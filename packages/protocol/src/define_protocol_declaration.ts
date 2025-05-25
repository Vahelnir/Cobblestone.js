import type { Protocol } from "./index.js";
import type { TypeMappingsDeclaration } from "./type_mappings.js";
import type { ProtocolStateDeclaration } from "./types.js";

export function defineProtocolDeclaration<
  ServerPacketMap extends Record<string, any>,
  ClientPacketMap extends Record<string, any>,
  Types extends TypeMappingsDeclaration<any>,
>(protocol: {
  version: number;
  packetTypes: {
    server: ServerPacketMap;
    client: ClientPacketMap;
  };
  types: Types;
  states: Record<
    number,
    ProtocolStateDeclaration<keyof Types extends string ? keyof Types : never>
  >;
}): Protocol<ServerPacketMap, ClientPacketMap> {
  return { ...protocol, packetMaps: undefined } as any;
}
