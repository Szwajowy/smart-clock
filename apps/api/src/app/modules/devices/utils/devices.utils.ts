import { Device } from '../entities/device.entity';

export function isSerialUsed(serial: string, devices: Device[]): boolean {
  return devices.find((device) => device.serial === serial) ? true : false;
}
