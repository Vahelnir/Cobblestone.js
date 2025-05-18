import type { ConnectionState } from "./index.js";

export type PacketSchemaItem<TypeMapping> = {
  name: string;
  type: keyof TypeMapping;
  length?: number;
};
export type PacketSchema<TypeMapping> = PacketSchemaItem<TypeMapping>[];

export type PacketDeclaration<TypeMapping> = {
  id: number;
  name: string;
  schema: PacketSchema<TypeMapping>;
  handle?: (state: ConnectionState, packet: any) => void;
};

export type ProtocolStateDeclaration<TypeMapping> = {
  id: number;
  name: string;
  packets: {
    serverbound: Record<number, PacketDeclaration<TypeMapping>>;
    clientbound: Record<number, PacketDeclaration<TypeMapping>>;
  };
};
