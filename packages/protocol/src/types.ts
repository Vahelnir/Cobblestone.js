import type { ConnectionState } from "./index.js";

export type PacketDeclaration<TypeMapping> = {
  id: number;
  name: string;
  schema: {
    name: string;
    type: keyof TypeMapping;
    length?: number;
  }[];
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
