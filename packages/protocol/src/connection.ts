import { createCipheriv, createDecipheriv } from "node:crypto";
import EventEmitter from "node:events";
import type { Socket } from "node:net";
import { CustomBuffer } from "@cobblestonejs/buffer";

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
  private cipher: ReturnType<typeof createCipheriv> | undefined;
  private decipher: ReturnType<typeof createDecipheriv> | undefined;

  constructor(
    public state: ConnectionState,
    public socket: Socket,
  ) {
    super();

    socket.on("data", async (buffer) => {
      console.log("Data received from client:", buffer);
      if (this.decipher) {
        buffer = this.decipher?.update(buffer);
      }
      const customBuffer = new CustomBuffer(buffer);
      while (customBuffer.bytesAvailable > 0) {
        const packet = await parse(state, customBuffer);
        console.log("Parsed packet:", packet);
        // @ts-expect-error
        this.emit(packet.name, packet);
      }
    });
  }

  async send<
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
  ): Promise<void>;
  async send(name: string, data: any) {
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
    await packet.schema.write(packetBuffer, data);

    // adding the length to the packet
    const packetWithLength = new CustomBuffer();
    packetWithLength.writeVarInt(packetBuffer.length);
    packetWithLength.writeBytes(packetBuffer);

    // sending the packet
    if (this.cipher) {
      const encrypted = this.cipher.update(packetWithLength.buffer);
      this.socket.write(encrypted);
    } else {
      this.socket.write(packetWithLength.buffer);
    }

    // try parsing the packet to see if it works
    packetWithLength.position = 0; // Reset position for parsing
    const parsedPacket = await parse(
      {
        ...this.state,
        bound:
          this.state.bound === "clientbound" ? "serverbound" : "clientbound",
      },
      packetWithLength,
    );
    if (!parsedPacket) {
      throw new Error(`Failed to parse sent packet '${packet.name}'`);
    }

    console.log(
      `Sent packet '${packet.name}' is valid!`,
      deepEqual(parsedPacket.data, data),
    );
  }

  setSharedSecret(sharedSecret: Buffer) {
    console.log("Enabling encryption");
    // AES-128-CFB8: key is 16 bytes, IV is the same as the key
    this.cipher = createCipheriv("aes-128-cfb8", sharedSecret, sharedSecret);
    this.decipher = createDecipheriv(
      "aes-128-cfb8",
      sharedSecret,
      sharedSecret,
    );
  }
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}
