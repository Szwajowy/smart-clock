export function deepCloneObject(object: any) {
  return JSON.parse(JSON.stringify(object));
}
