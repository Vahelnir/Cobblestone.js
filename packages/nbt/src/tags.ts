export type NBTEndTag = { type: "end" };
export type NBTByteTag = { type: "byte"; name?: string; value: number };
export type NBTShortTag = { type: "short"; name?: string; value: number };
export type NBTIntTag = { type: "int"; name?: string; value: number };
export type NBTLongTag = { type: "long"; name?: string; value: bigint };
export type NBTFloatTag = { type: "float"; name?: string; value: number };
export type NBTDoubleTag = { type: "double"; name?: string; value: number };
export type NBTByteArrayTag = {
  type: "byte_array";
  name?: string;
  value: Buffer;
};
export type NBTStringTag = { type: "string"; name?: string; value: string };
export type NBTListTag = {
  type: "list";
  name?: string;
  value: NBTTag[];
};
export type NBTCompoundTag = {
  type: "compound";
  name?: string;
  value: NBTTag[];
};
export type NBTIntArrayTag = {
  type: "int_array";
  name?: string;
  value: number[];
};
export type NBTLongArrayTag = {
  type: "long_array";
  name?: string;
  value: bigint[];
};

export type NBTTag =
  | NBTEndTag
  | NBTByteTag
  | NBTShortTag
  | NBTIntTag
  | NBTLongTag
  | NBTFloatTag
  | NBTDoubleTag
  | NBTByteArrayTag
  | NBTStringTag
  | NBTListTag
  | NBTCompoundTag
  | NBTIntArrayTag
  | NBTLongArrayTag;
