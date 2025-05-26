import type { CustomBuffer } from "@cobblestonejs/buffer";

import type { ConnectionState } from "../index.js";

export type Protocol<
  ServerPackets = Record<string, unknown>,
  ClientPackets = Record<string, unknown>,
> = {
  __serverPackets: ServerPackets;
  __clientPackets: ClientPackets;
  version: number;
  states: Partial<Record<number, ProtocolStateDeclaration>>;
};

export type TypegenType = {
  type: string;
  declarations?: string[];
  imports?: string[];
};

export interface ProtocolType<T> {
  write(buffer: CustomBuffer, value: T): Promise<unknown>;
  read(buffer: CustomBuffer): Promise<T>;
  typegen?: () => TypegenType | Promise<TypegenType>;
}

export type PacketSchemaItem = {
  name: string;
  type: ProtocolType<unknown>;
};
export type PacketSchema = Record<string, ProtocolType<any>>;

export type PacketDeclaration = {
  id: number;
  name: string;
  schema: ProtocolType<Record<string, unknown>>;
  beforeEvent?: (state: ConnectionState, packet: any) => void;
};

export type ProtocolStateDeclaration = {
  id: number;
  name: string;
  packets: {
    serverbound: Record<number, PacketDeclaration>;
    clientbound: Record<number, PacketDeclaration>;
  };
};

export function defineProtocolDeclaration<
  ServerPacketMap extends Record<string, any>,
  ClientPacketMap extends Record<string, any>,
>(protocol: {
  version: number;
  states: Record<number, ProtocolStateDeclaration>;
}): Protocol<ServerPacketMap, ClientPacketMap> {
  return { ...protocol, packetMaps: undefined } as any;
}
