import { isLittleEndian } from "../../mod.ts";
import { SizedType } from "../mod.ts";
import { Options } from "../types/common.ts";

export class U128 extends SizedType<bigint> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(16, 8);
  }

  writePacked(value: bigint, dt: DataView, options: Options = { byteOffset: 0 }): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    const first = BigInt.asIntN(64, value);
    const second = BigInt.asUintN(64, value >> 64n);

    if (this.littleEndian) {
      dt.setBigUint64(options.byteOffset, first, true)
      dt.setBigUint64(options.byteOffset + 8, second, true)
    } else {
      dt.setBigUint64(options.byteOffset + 8, first, false)
      dt.setBigUint64(options.byteOffset, second, false)
    }
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    let lo, hi;
    if (this.littleEndian) {
      lo = dt.getBigUint64(options.byteOffset, true);
      hi = dt.getBigUint64(options.byteOffset + 8, true);
    } else {
      hi = dt.getBigUint64(options.byteOffset, false);
      lo = dt.getBigUint64(options.byteOffset + 8, false);
    }
    super.incrementOffset(options);
    return hi << 64n | lo;
  }
}

export const u128le: U128 = new U128(true);
export const u128be: U128 = new U128(false);
export const u128: U128 = new U128();
