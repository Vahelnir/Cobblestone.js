import { writeFile } from "fs/promises";
import { resolve } from "path";
import { Command } from "commander";
import { format } from "prettier";

import type { Protocol } from "../../protocol/src/protocol-definition/protocol.js";

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

    const protocol = module.default as Protocol;

    const packets = {
      clientbound: [] as { id: number; name: string; data: string }[],
      serverbound: [] as { id: number; name: string; data: string }[],
    };

    const typeDeclarations = new Set<string>();

    for (const state of Object.values(protocol.states)) {
      if (!state) {
        console.warn(
          `State '${state}' does not have packets defined, skipping.`,
        );
        continue;
      }

      for (const bound of ["clientbound", "serverbound"] as const) {
        for (const packet of Object.values(state.packets[bound])) {
          const rawTypegen = packet.schema.typegen?.();
          const typegen =
            rawTypegen instanceof Promise ? await rawTypegen : rawTypegen;
          const type = typegen?.type ?? "unknown";
          typegen?.declarations?.forEach((declaration) =>
            typeDeclarations.add(declaration),
          );

          packets[bound].push({
            id: packet.id,
            name: `${state.name}:${packet.name}`,
            data: type,
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

    const content = await format(
      `${Array.from(typeDeclarations).join("\n")}
        
       export type ClientPacketMap = { ${clientPackets} }
       export type ClientPackets = ClientPacketMap[keyof ClientPacketMap];

       export type ServerPacketMap = { ${serverPackets} }
       export type ServerPackets = ServerPacketMap[keyof ServerPacketMap];

       export type AllPackets = ClientPackets | ServerPackets`,
      { parser: "typescript" },
    );
    await writeFile(resolve(source, "types.ts"), content);
  });

program.parse();
