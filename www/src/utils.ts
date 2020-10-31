export function orPanic<T>(val: T | null): T {
  if (val == null) {
    throw new Error("Can't be null");
  }

  return val;
}
