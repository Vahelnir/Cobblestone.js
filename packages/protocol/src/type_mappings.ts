import { CustomBuffer } from "./custom_buffer.js";

export type TypeMappingsDeclaration = {
  [key: string]: TypeMappingDeclaration<any>;
};

type TypeMappingDeclaration<Primitive extends keyof Primitives> = {
  type: Primitive;
  read: (buffer: CustomBuffer) => Primitives[Primitive];
  write: (buffer: CustomBuffer, value: Primitives[Primitive]) => CustomBuffer;
};

type InferTypeMapping<T extends { type: keyof Primitives }> = T extends {
  type: infer P;
}
  ? P extends keyof Primitives
    ? {
        type: P;
        read: (buffer: CustomBuffer) => Primitives[P];
        write: (buffer: CustomBuffer, value: Primitives[P]) => CustomBuffer;
      }
    : never
  : never;

export function defineTypeMappings<
  T extends Record<string, { type: keyof Primitives }>,
>(mappings: { [K in keyof T]: InferTypeMapping<T[K]> }): {
  [K in keyof T]: InferTypeMapping<T[K]>;
};
export function defineTypeMappings(
  mappings: TypeMappingsDeclaration,
): TypeMappingsDeclaration {
  return mappings;
}

type Primitives = {
  boolean: boolean;
  string: string;
  number: number;
  bigint: bigint;
};
