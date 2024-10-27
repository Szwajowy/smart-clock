import { Injectable } from '@nestjs/common';

import { DeviceInfo, DeviceInfoRepository } from 'data-access-device-info';
import { Device } from '../interfaces/device.interface';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceInfoRepository: DeviceInfoRepository) {}

  async findAll(): Promise<Device[]> {
    const deviceInfos = await this.deviceInfoRepository.findAll();
    const devices: Device[] = deviceInfos.map(
      (deviceInfo) =>
        ({
          serial: deviceInfo.serial,
        } as Device)
    );

    return devices;
  }

  async findOne(serial: string): Promise<Device> {
    const deviceInfo = await this.deviceInfoRepository.findOne(serial);
    const device = {
      serial: deviceInfo.serial,
    } as Device;

    return device;
  }

  async create(newDevice: Pick<Device, 'serial'>): Promise<Device> {
    const newDeviceInfo = await this.deviceInfoRepository.create({
      serial: newDevice.serial,
    } as DeviceInfo);

    return { serial: newDeviceInfo.serial } as Device;
  }

  async update(updatedDevice: Pick<Device, 'serial'>): Promise<Device> {
    const updatedDeviceInfo = await this.deviceInfoRepository.update({
      serial: updatedDevice.serial,
    } as DeviceInfo);

    return { serial: updatedDeviceInfo.serial } as Device;
  }
}
