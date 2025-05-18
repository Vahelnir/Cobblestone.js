import { CustomBuffer } from "./custom_buffer.js";

export type TypeMappingsDeclaration = {
  [key: string]: TypeMappingDeclaration<keyof Primitives>;
};

type TypeMappingDeclaration<Primitive extends keyof Primitives> = {
  type: Primitive;
  read: (buffer: CustomBuffer) => Primitives[Primitive];
  write: (buffer: CustomBuffer, value: Primitives[Primitive]) => CustomBuffer;
};

export function defineTypeMappings<
  M extends Record<string, { type: keyof Primitives }>,
>(
  mappings: M & {
    [K in keyof M]: TypeMappingDeclaration<M[K]["type"]>;
  },
): M & {
  [K in keyof M]: TypeMappingDeclaration<M[K]["type"]>;
} {
  return mappings;
}

type Primitives = {
  boolean: boolean;
  string: string;
  number: number;
  bigint: bigint;
};
