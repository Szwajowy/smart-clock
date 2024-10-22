import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Device } from '../interfaces/device.interface';
import { isSerialUsed } from '../utils/devices.utils';

@Injectable()
export class DevicesService {
  private devices: Device[] = [];

  getDevices(): Device[] {
    return this.devices;
  }

  getDevice(id: string): Device | undefined {
    return this.devices.find((device) => device.serial === id);
  }

  createDevice(device: Device): Device {
    if (isSerialUsed(device.serial, this.devices))
      throw new HttpException(
        'Device with this serial already exists',
        HttpStatus.BAD_REQUEST
      );

    this.devices.push(device);
    return this.getDevice(device.serial);
  }

  updateDevice(device: Partial<Device>): Device {
    const updatedDeviceIndex = this.devices.findIndex(
      (foundDevice) => (foundDevice.serial = device.serial)
    );
    this.devices[updatedDeviceIndex] = {
      ...this.devices[updatedDeviceIndex],
      ...device,
    };
    return this.getDevice(device.serial);
  }
}
