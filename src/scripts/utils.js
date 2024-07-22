export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return typeof value === "object" && !isArray(value);
}

export function isPrimitive(value) {
  return !isObject(value) && !isArray(value);
}
