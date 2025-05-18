import { EventEmitter } from "node:events";
import type { Socket } from "node:net";

import { CustomBuffer } from "./custom_buffer.js";
import type { TypeMappingsDeclaration } from "./type_mappings.js";
import type { ProtocolStateDeclaration } from "./types.js";

export type Protocol<T> = {
  version: number;
  types: T;
  states: Record<number, ProtocolStateDeclaration<T>>;
};

export type Packet<D = any> = {
  id: number;
  name: string;
  data: D;
};

export type ConnectionState<
  P extends
    Protocol<TypeMappingsDeclaration> = Protocol<TypeMappingsDeclaration>,
> = {
  bound: "clientbound" | "serverbound";
  protocol: P;
  protocolState: number;
  version: number | undefined;
};

export function createClient<P extends Protocol<any>>(
  bound: "clientbound" | "serverbound",
  socket: Socket,
  protocol: P,
) {
  const state: ConnectionState<P> = {
    bound,
    protocol,
    protocolState: 0,
    version: undefined,
  };
  const eventEmitter = new EventEmitter();

  socket.on("data", (buffer) => {
    console.log("Data received from client:", buffer);
    const customBuffer = new CustomBuffer(buffer);
    while (customBuffer.bytesAvailable > 0) {
      const packet = parse(state, customBuffer);
      console.log("Parsed packet:", packet);
      eventEmitter.emit(packet.name, packet);
    }
  });

  return Object.assign(eventEmitter, {
    send(name: string, data: any) {
      console.log("Sending packet:", name, data);
      const packetName = name.split(":")[1];
      // TODO: pre-computed a map of packet names to ids
      // find the packet declaration of the given packet name
      const packet = Object.values(
        state.protocol.states[state.protocolState].packets[
          state.bound === "clientbound" ? "serverbound" : "clientbound"
        ],
      ).find((packet) => packet.name === packetName);
      if (!packet) {
        throw new Error(
          `Packet "${packetName}" not found in state ${state.protocolState}`,
        );
      }

      // serializing
      const packetBuffer = new CustomBuffer();
      packetBuffer.writeVarInt(packet.id);
      for (const field of packet.schema) {
        const type = state.protocol.types[field.type];
        if (!type) {
          throw new Error(`Type ${field.type.toString()} not found`);
        }

        const name = field.name;
        if (data[name] === undefined) {
          throw new Error(`Field ${name} is missing from packet data`);
        }
        type.write(packetBuffer, data[name]);
      }

      // adding the length to the packet
      const packetWithLength = new CustomBuffer();
      packetWithLength.writeVarInt(packetBuffer.length);
      packetWithLength.writeBytes(packetBuffer);

      // sending the packet
      socket.write(packetWithLength.buffer);

      // try parsing the packet to see if it works
      // const parsedPacket = parse(
      //   {
      //     ...state,
      //     bound: state.bound === "clientbound" ? "serverbound" : "clientbound",
      //   },
      //   packetWithLength,
      // );
      // console.log("Sent packet parsed:", parsedPacket);
    },
  });
}

export function parse<P extends Protocol<any>>(
  connectionState: ConnectionState<P>,
  buffer: Buffer | CustomBuffer,
): any;
export function parse(
  state: ConnectionState<Protocol<TypeMappingsDeclaration>>,
  buffer: Buffer | CustomBuffer,
): any {
  const customBuffer =
    buffer instanceof CustomBuffer ? buffer : new CustomBuffer(buffer);
  const length = customBuffer.readVarInt();
  let startPosition = customBuffer.position;
  const packetId = customBuffer.readVarInt();
  const remainingLength = length - (customBuffer.position - startPosition);
  const rawPacket = customBuffer.readCustomBuffer(remainingLength);

  const protocolStateDeclaration = state.protocol.states[state.protocolState];
  const packetDeclaration =
    protocolStateDeclaration.packets[state.bound][packetId];
  if (!packetDeclaration) {
    throw new Error(
      `Packet ${packetId} not found in state ${state.protocolState}`,
    );
  }

  const data = packetDeclaration.schema.reduce((acc, field) => {
    const type = state.protocol.types[field.type];
    if (!type) {
      throw new Error(`Type ${field.type} not found`);
    }

    const value = type.read(rawPacket);
    return { ...acc, [field.name]: value };
  }, {} as any);

  const packet = {
    id: packetId,
    name: `${protocolStateDeclaration.name}:${packetDeclaration.name}`,
    data,
  };
  if (packetDeclaration.handle) {
    packetDeclaration.handle(state, packet);
  }

  return packet;
}
