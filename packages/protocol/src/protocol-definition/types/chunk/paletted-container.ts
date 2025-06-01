import type { CustomBuffer } from "@cobblestonejs/buffer";

import type { ProtocolType } from "../../protocol.js";
import { long, prefixedArray, ubyte, varint } from "../../types.js";

export type DirectPalette = {
  kind: "direct";
  bitsPerEntry: number;
};
class DirectPaletteType implements ProtocolType<DirectPalette> {
  constructor(public bitsPerEntry: number) {}

  async write(buffer: CustomBuffer, value: DirectPalette) {
    if (value.bitsPerEntry !== this.bitsPerEntry) {
      throw new Error(
        `Bits per entry mismatch: expected ${this.bitsPerEntry}, got ${value.bitsPerEntry}`,
      );
    }
  }

  async read(buffer: CustomBuffer): Promise<DirectPalette> {
    return {
      kind: "direct",
      bitsPerEntry: this.bitsPerEntry,
    };
  }
}

export type SinglePalette = {
  kind: "single";
  bitsPerEntry: number;
  value: number;
};
class SinglePaletteType implements ProtocolType<SinglePalette> {
  constructor(public bitsPerEntry: number) {}

  async write(buffer: CustomBuffer, value: SinglePalette) {
    if (value.bitsPerEntry !== this.bitsPerEntry) {
      throw new Error(
        `Bits per entry mismatch: expected ${this.bitsPerEntry}, got ${value.bitsPerEntry}`,
      );
    }
    await varint().write(buffer, value.value);
  }

  async read(buffer: CustomBuffer): Promise<SinglePalette> {
    return {
      kind: "single",
      bitsPerEntry: this.bitsPerEntry,
      value: await varint().read(buffer),
    };
  }
}

export type IndirectPalette = {
  kind: "indirect";
  bitsPerEntry: number;
  entries: number[];
};
class IndirectPaletteType implements ProtocolType<IndirectPalette> {
  constructor(public bitsPerEntry: number) {}

  async write(buffer: CustomBuffer, value: IndirectPalette) {
    if (value.bitsPerEntry !== this.bitsPerEntry) {
      throw new Error(
        `Bits per entry mismatch: expected ${this.bitsPerEntry}, got ${value.bitsPerEntry}`,
      );
    }
    await prefixedArray({ type: varint() }).write(buffer, value.entries);
  }

  async read(buffer: CustomBuffer): Promise<IndirectPalette> {
    return {
      kind: "indirect",
      bitsPerEntry: this.bitsPerEntry,
      entries: (await prefixedArray({ type: varint() }).read(
        buffer,
      )) as number[],
    };
  }
}

export type PalettedContainer = {
  palette: DirectPalette | IndirectPalette | SinglePalette;
  data: bigint[];
};
class PalettedContainerType implements ProtocolType<PalettedContainer> {
  constructor(public type: "biome" | "blocks") {}

  async write(buffer: CustomBuffer, value: PalettedContainer) {
    await ubyte().write(buffer, value.palette.bitsPerEntry);
    await this.#findPalette(value.palette.bitsPerEntry).write(
      buffer,
      value.palette as any, // TODO: see if I can remove this as any
    );
    await prefixedArray({ type: long() }).write(buffer, value.data);
  }

  async read(buffer: CustomBuffer): Promise<PalettedContainer> {
    const bitsPerEntry = await ubyte().read(buffer);
    const palette = await this.#findPalette(bitsPerEntry).read(buffer);
    const data = await prefixedArray({ type: long() }).read(buffer);

    return {
      palette,
      data: data as bigint[],
    };
  }

  #findPalette(
    bitsPerEntry: number,
  ):
    | ProtocolType<DirectPalette>
    | ProtocolType<IndirectPalette>
    | ProtocolType<SinglePalette> {
    if (this.type === "biome") {
      // TODO: apparently depends on the biome registry that is sent with registry_data
      if (bitsPerEntry <= 1) {
        return new SinglePaletteType(bitsPerEntry);
      }

      if (bitsPerEntry <= 3) {
        return new IndirectPaletteType(bitsPerEntry);
      }

      return new DirectPaletteType(bitsPerEntry);
    }

    if (this.type === "blocks") {
      if (bitsPerEntry <= 4) {
        return new SinglePaletteType(bitsPerEntry);
      }

      if (bitsPerEntry <= 8) {
        return new IndirectPaletteType(bitsPerEntry);
      }

      return new DirectPaletteType(bitsPerEntry);
    }

    throw new Error(
      `Invalid bitsPerEntry for ${this.type} paletted container: ${bitsPerEntry}`,
    );
  }

  typegen() {
    return {
      type: "PalettedContainer",
      declarations: [
        `type PalettedContainer = {
          bitsPerEntry: number;
          palette: NBTTag[];
          data: bigint[];
        }`,
      ],
    };
  }
}

export function palettedContainer(
  type: "biome" | "blocks",
): ProtocolType<PalettedContainer> {
  return new PalettedContainerType(type);
}
