import type { Socket } from "node:net";
import { createClient, parse } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";
import { CustomBuffer } from "@cobblestonejs/protocol/custom_buffer";

export type ProtocolState = "handshaking" | "status" | "configuration" | "play";
export const ProtocolStateMeta: Record<number, ProtocolState> = {
  0: "handshaking",
  1: "status",
  2: "configuration",
  3: "play",
};

export class Client {
  public protocolState: ProtocolState = "handshaking";

  constructor(private socket: Socket) {
    createClient("serverbound", socket, protocol770);
  }

  public send(data: Buffer) {
    this.socket.write(data);
  }

  public disconnect() {
    this.socket.destroy();
    console.log("Client disconnected");
  }
}
