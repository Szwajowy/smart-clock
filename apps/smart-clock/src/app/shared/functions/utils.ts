export function cloneObject(object: unknown) {
  return JSON.parse(JSON.stringify(object));
}
