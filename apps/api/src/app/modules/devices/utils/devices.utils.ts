import { Device } from '../interfaces/device.interface';

export function isSerialUsed(serial: string, devices: Device[]): boolean {
  return devices.find((device) => device.serial === serial) ? true : false;
}
