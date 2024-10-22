import { Injectable } from '@nestjs/common';
import { Device } from '../interfaces/device.interface';

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
