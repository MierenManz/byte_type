import { type InnerType, type Options, UnsizedType } from "../types/mod.ts";
import { align, alignmentOf } from "../util.ts";

export class Struct<
  T extends Record<string, UnsizedType<unknown>>,
  V extends { [K in keyof T]: InnerType<T[K]> } = {
    [K in keyof T]: InnerType<T[K]>;
  },
> extends UnsizedType<V> {
  #record: Array<[string, UnsizedType<unknown>]>;
  override readonly maxSize: number | null;

  constructor(input: T) {
    super(alignmentOf(input));
    this.#record = Object.entries(input);
    this.maxSize = this.#record.every(([_, a]) => a.maxSize !== null)
      ? this.#record.reduce(
        (acc, [_, x]) => acc + align(Number(x.maxSize), this.byteAlignment),
        0,
      )
      : null;
  }

  readPacked(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.readPacked(dt, options);
    }

    return result as V;
  }

  override read(dt: DataView, options: Options = { byteOffset: 0 }): V {
    if (this.#record.length === 0) return {} as V;

    const result: Record<string, unknown> = {};

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      result[key] = type.read(dt, options);
    }

    return result as V;
  }

  writePacked(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (this.#record.length === 0) return;

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.writePacked(value[key], dt, options);
    }
  }

  override write(
    value: V,
    dt: DataView,
    options: Options = { byteOffset: 0 },
  ): void {
    if (this.#record.length === 0) return;

    for (let i = 0; i < this.#record.length; i++) {
      const { 0: key, 1: type } = this.#record[i];
      type.write(value[key], dt, options);
    }
  }
}
