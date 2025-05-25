import EventEmitter from "node:events";
import type { Socket } from "node:net";

import { CustomBuffer } from "./custom-buffer.js";
import { parse, type ConnectionState } from "./index.js";
import type { Protocol } from "./protocol-definition/protocol.js";

export class Connection<
  P extends Protocol = Protocol,
  Bound extends "clientbound" | "serverbound" = "clientbound" | "serverbound",
> extends EventEmitter<{
  [K in keyof P[Bound extends "clientbound"
    ? "__clientPackets"
    : "__serverPackets"]]: [
    P[Bound extends "clientbound" ? "__clientPackets" : "__serverPackets"][K],
  ];
}> {
  constructor(
    public state: ConnectionState,
    public socket: Socket,
  ) {
    super();

    socket.on("data", async (buffer) => {
      console.log("Data received from client:", buffer);
      const customBuffer = new CustomBuffer(buffer);
      while (customBuffer.bytesAvailable > 0) {
        const packet = await parse(state, customBuffer);
        console.log("Parsed packet:", packet);
        // @ts-expect-error
        this.emit(packet.name, packet);
      }
    });
  }

  send<
    N extends keyof P[Bound extends "clientbound"
      ? "__serverPackets"
      : "__clientPackets"],
  >(
    name: N,
    data: P[Bound extends "clientbound"
      ? "__serverPackets"
      : "__clientPackets"][N] extends { data: infer D }
      ? D
      : unknown,
  ): void;
  send(name: string, data: any) {
    console.log("Sending packet:", name, data);
    const packetName = name.split(":")[1];
    // TODO: pre-computed a map of packet names to ids
    // find the packet declaration of the given packet name
    const currentState = this.state.protocol.states[this.state.protocolState];
    if (!currentState) {
      throw new Error(
        `Protocol state ${this.state.protocolState} not found in protocol`,
      );
    }

    const packet = Object.values(
      currentState.packets[
        this.state.bound === "clientbound" ? "serverbound" : "clientbound"
      ],
    ).find((packet) => packet.name === packetName);
    if (!packet) {
      throw new Error(
        `Packet "${packetName}" not found in state ${this.state.protocolState}`,
      );
    }

    // serializing
    const packetBuffer = new CustomBuffer();
    packetBuffer.writeVarInt(packet.id);
    packet.schema.write(packetBuffer, data);

    // adding the length to the packet
    const packetWithLength = new CustomBuffer();
    packetWithLength.writeVarInt(packetBuffer.length);
    packetWithLength.writeBytes(packetBuffer);

    // sending the packet
    this.socket.write(packetWithLength.buffer);

    // try parsing the packet to see if it works
    // const parsedPacket = parse(
    //   {
    //     ...state,
    //     bound: state.bound === "clientbound" ? "serverbound" : "clientbound",
    //   },
    //   packetWithLength,
    // );
    // console.log("Sent packet parsed:", parsedPacket);
  }
}
