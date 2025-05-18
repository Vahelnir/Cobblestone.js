import type { Socket } from "node:net";

import { Connection } from "./connection.js";
import { CustomBuffer } from "./custom_buffer.js";
import type { TypeMappingsDeclaration } from "./type_mappings.js";
import type { ProtocolStateDeclaration } from "./types.js";

export type Protocol<
  T,
  ServerPackets = Record<string, unknown>,
  ClientPackets = Record<string, unknown>,
> = {
  __serverPackets: ServerPackets;
  __clientPackets: ClientPackets;
  version: number;
  types: T;
  states: Record<number, ProtocolStateDeclaration<T>>;
};

export type Packet<D = any> = {
  id: number;
  name: string;
  data: D;
};

export type ConnectionState<P extends Protocol<any> = Protocol<any>> = {
  bound: "clientbound" | "serverbound";
  protocol: P;
  protocolState: number;
  version: number | undefined;
};

export function createClient<
  B extends "clientbound" | "serverbound",
  P extends Protocol<any>,
>(bound: B, socket: Socket, protocol: P): Connection<P, B>;
export function createClient(
  bound: "clientbound" | "serverbound",
  socket: Socket,
  protocol: Protocol<any>,
) {
  return new Connection(
    {
      bound,
      protocol,
      protocolState: 0,
      version: undefined,
    },
    socket,
  );
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
