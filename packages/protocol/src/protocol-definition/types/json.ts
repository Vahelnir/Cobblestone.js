import { defineProtocolType } from "../protocol-type.js";

export type JSONPrimitive = "string" | "number" | "boolean" | "null";
export type JSONArray = { type: "array"; items: JSONType };
export type JSONObject = {
  type: "object";
  properties: Record<string, JSONType>;
};
export type JSONType = JSONPrimitive | JSONArray | JSONObject;

function schemaToString(schema: JSONType): string {
  if (typeof schema === "string") {
    return schema;
  }

  if (schema.type === "object") {
    const properties = Object.entries(schema.properties)
      .map(([key, value]) => `${key}: ${schemaToString(value)}`)
      .join(", ");
    return `{ ${properties} }`;
  }

  if (schema.type === "array") {
    return `${schemaToString(schema.items)}[]`;
  }

  throw new Error(`Unsupported JSON schema type: ${JSON.stringify(schema)}`);
}

export const json = defineProtocolType<any, JSONType>((schema) => {
  return {
    write: async (buffer, value) => buffer.writeString(JSON.stringify(value)),
    read: async (buffer) => JSON.parse(buffer.readString()),
    typegen: async () => ({
      type: schemaToString(schema),
    }),
  };
});
