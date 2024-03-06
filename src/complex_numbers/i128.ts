import { isLittleEndian } from "../../mod.ts";
import { SizedType } from "../mod.ts";
import { Options } from "../types/common.ts";

export class I128 extends SizedType<bigint> {
  constructor(readonly littleEndian = isLittleEndian) {
    super(16, 8);
  }

  writePacked(value: bigint, dt: DataView, options: Options = { byteOffset: 0 }): void {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    if (this.littleEndian) {
      dt.setBigInt64(options.byteOffset, BigInt.asIntN(64, value), true)
      dt.setBigUint64(options.byteOffset + 8, BigInt.asUintN(64, value >> 64n), true)
    } else {
      dt.setBigInt64(options.byteOffset + 8, BigInt.asIntN(64, value), false)
      dt.setBigUint64(options.byteOffset, BigInt.asUintN(64, value >> 64n), false)
    }
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): bigint {
    super.rangeCheck(dt.byteLength, options.byteOffset);
    let lo, hi;
    if (this.littleEndian) {
      lo = dt.getBigInt64(options.byteOffset, true);
      hi = dt.getBigUint64(options.byteOffset + 8, true);
    } else {
      hi = dt.getBigInt64(options.byteOffset, false);
      lo = dt.getBigUint64(options.byteOffset + 8, false);
    }
    super.incrementOffset(options);
    return hi << 64n | lo;
  }
}

export const i128le: I128 = new I128(true);
export const i128be: I128 = new I128(false);
export const i128: I128 = new I128();
