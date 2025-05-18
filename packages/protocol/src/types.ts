import type { ConnectionState } from "./index.js";
import type { TypeMappingsDeclaration } from "./type_mappings.js";

export type PacketSchemaItem<Types extends string = string> = {
  name: string;
  type: Types;
  length?: number;
};
export type PacketSchema<Types extends string> = PacketSchemaItem<Types>[];

export type PacketDeclaration<Types extends string> = {
  id: number;
  name: string;
  schema: PacketSchema<Types>;
  handle?: (state: ConnectionState, packet: any) => void;
};

export type ProtocolStateDeclaration<Types extends string> = {
  id: number;
  name: string;
  packets: {
    serverbound: Record<number, PacketDeclaration<Types>>;
    clientbound: Record<number, PacketDeclaration<Types>>;
  };
};
