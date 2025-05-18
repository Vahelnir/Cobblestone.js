import { writeFile } from "fs/promises";
import { resolve } from "path";
import type { Protocol } from "@cobblestonejs/protocol";
import { Command } from "commander";

import type { TypeMappingsDeclaration } from "../../protocol/src/type_mappings.js";
import type { PacketSchema } from "../../protocol/src/types.js";

const program = new Command();
program
  .name("type-generator")
  .description("CLI to generate protocol types")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate types from a source")
  .argument("<source>", "The source to generate types from")
  .action(async (source) => {
    console.log(`Generating types from ${source}`);
    const protocolFilePath = resolve(source, "protocol.ts");
    const module = await import(protocolFilePath);

    const protocol = module.default as Protocol<TypeMappingsDeclaration>;

    const packets = {
      clientbound: [] as { id: number; name: string; data: string }[],
      serverbound: [] as { id: number; name: string; data: string }[],
    };
    for (const state of Object.values(protocol.states)) {
      for (const bound of ["clientbound", "serverbound"] as const) {
        for (const packet of Object.values(state.packets[bound])) {
          packets[bound].push({
            id: packet.id,
            name: `${state.name}:${packet.name}`,
            data: schemaToType(protocol.types, packet.schema),
          });
        }
      }
    }

    const clientPackets = packets.clientbound
      .map((packet) => {
        return `"${packet.name}": { id: ${packet.id}, name: "${packet.name}", data: ${packet.data} }`;
      })
      .join(";\n");
    const serverPackets = packets.serverbound
      .map((packet) => {
        return `"${packet.name}": { id: ${packet.id}, name: "${packet.name}", data: ${packet.data} }`;
      })
      .join(";\n");
    console.log(`Protocol file path: ${protocolFilePath}`);
    // TODO: use prettier to format the output
    await writeFile(
      resolve(source, "types.ts"),
      `export type ClientPacketMap = { ${clientPackets} }
       export type ClientPackets = ClientPacketMap[keyof ClientPacketMap];
       export type ServerPacketMap = { ${serverPackets} }
       export type ServerPackets = ServerPacketMap[keyof ServerPacketMap];
       export type AllPackets = ClientPackets | ServerPackets`,
    );
  });

program.parse();

function schemaToType(
  types: TypeMappingsDeclaration,
  schema: PacketSchema<any>,
) {
  const properties = schema
    .map((item) => {
      const type = types[item.type.toString()];
      if (!type) {
        return;
      }
      return `${item.name}: ${type.type}`;
    })
    .filter((item) => item !== undefined)
    .join("; ");
  return `{ ${properties} }`;
}
