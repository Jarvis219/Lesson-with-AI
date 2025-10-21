// utils/isEmpty.ts
export function isEmpty(value: unknown): boolean {
  // null or undefined
  if (value == null) return true;

  // string
  if (typeof value === "string") return value.trim().length === 0;

  // array
  if (Array.isArray(value)) return value.length === 0;

  // Map or Set
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // Typed arrays (e.g. Uint8Array)
  if (ArrayBuffer.isView(value))
    return (value as ArrayBufferView).byteLength === 0;

  // plain object
  if (typeof value === "object") {
    return Object.keys(value as Record<string, any>).length === 0;
  }

  // everything else (number, boolean, function, symbol, etc.) is not "empty"
  return false;
}
