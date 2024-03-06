import { type Options, SizedType } from "../mod.ts";

type U2Number = 0 | 1 | 2 | 3;

export class U2 extends SizedType<U2Number> {
  constructor() {
    super(1, 1);
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): U2Number {
    const v = dt.getUint8(options.byteOffset) & 0b11;
    super.incrementOffset(options);
    return v as U2Number;
  }

  writePacked(
    value: U2Number,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    dt.setUint8(options.byteOffset, value & 0b11);
    super.incrementOffset(options);
  }
}

export const u2: U2 = new U2();
