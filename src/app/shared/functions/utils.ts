export function cloneObject(object: any) {
  return JSON.parse(JSON.stringify(object));
}
