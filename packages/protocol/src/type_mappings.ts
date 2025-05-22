import { CustomBuffer } from "./custom_buffer.js";

type TypeMappingDeclaration<P extends keyof Primitives> = {
  type: P;
  read: (buffer: CustomBuffer) => Primitives[P];
  write: (buffer: CustomBuffer, value: Primitives[P]) => CustomBuffer;
};

// This mapped type ensures each mapping's `type` property matches its read/write signatures
export type TypeMappingsDeclaration<
  T extends { [K in keyof T]: keyof Primitives },
> = {
  [K in keyof T]: TypeMappingDeclaration<T[K]>;
};

export function defineTypeMappings<
  T extends { [K in keyof T]: keyof Primitives },
>(mappings: {
  [K in keyof T]: TypeMappingDeclaration<T[K]>;
}): TypeMappingsDeclaration<T>;
export function defineTypeMappings(
  mappings: TypeMappingsDeclaration<any>,
): TypeMappingsDeclaration<any> {
  return mappings;
}

type Primitives = {
  boolean: boolean;
  string: string;
  number: number;
  bigint: bigint;
};
