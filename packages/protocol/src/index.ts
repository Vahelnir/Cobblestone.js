import type { Socket } from "node:net";

import { Connection } from "./connection.js";
import { CustomBuffer } from "./custom-buffer.js";
import type { Protocol } from "./protocol-definition/protocol.js";

export type Packet<D = any> = {
  id: number;
  name: string;
  data: D;
};

export type ConnectionState<P extends Protocol = Protocol> = {
  bound: "clientbound" | "serverbound";
  protocol: P;
  protocolState: number;
  version: number | undefined;
};

export function createClient<
  B extends "clientbound" | "serverbound",
  P extends Protocol,
>(bound: B, socket: Socket, protocol: P): Connection<P, B>;
export function createClient(
  bound: "clientbound" | "serverbound",
  socket: Socket,
  protocol: Protocol,
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

export function parse<P extends Protocol>(
  connectionState: ConnectionState<P>,
  buffer: Buffer | CustomBuffer,
): Promise<any>;
export async function parse(
  state: ConnectionState<Protocol>,
  buffer: Buffer | CustomBuffer,
): Promise<any> {
  const customBuffer =
    buffer instanceof CustomBuffer ? buffer : new CustomBuffer(buffer);
  const length = customBuffer.readVarInt();
  let startPosition = customBuffer.position;
  const packetId = customBuffer.readVarInt();
  const remainingLength = length - (customBuffer.position - startPosition);
  const rawPacket = customBuffer.readCustomBuffer(remainingLength);

  const protocolStateDeclaration = state.protocol.states[state.protocolState];
  if (!protocolStateDeclaration) {
    throw new Error(
      `Protocol state ${state.protocolState} not found in protocol.`,
    );
  }
  const packetDeclaration =
    protocolStateDeclaration.packets[state.bound][packetId];
  if (!packetDeclaration) {
    throw new Error(
      `Packet ${packetId} not found in state ${state.protocolState}`,
    );
  }

  const data = await packetDeclaration.schema.read(rawPacket);

  const packet = {
    id: packetId,
    name: `${protocolStateDeclaration.name}:${packetDeclaration.name}`,
    data,
  };

  packetDeclaration.beforeEvent?.(state, packet);

  return packet;
}
