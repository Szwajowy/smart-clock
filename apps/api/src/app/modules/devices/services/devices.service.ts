import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesService {
  private devices: Device[] = [];

  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>
  ) {}

  findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  findOne(serial: string): Promise<Device> {
    return this.deviceRepository.findOneBy({ serial }).then((device) => {
      if (!device)
        throw new NotFoundException(
          `Device with "${serial}" id was not found.`
        );

      return device;
    });
  }

  create(device: Device): Promise<Device> {
    return this.deviceRepository
      .findOneBy({ serial: device.serial })
      .then((foundDevice) => {
        if (foundDevice)
          throw new HttpException(
            'Device with this serial already exists',
            HttpStatus.BAD_REQUEST
          );

        return this.deviceRepository.create(device);
      });
  }

  update(device: Partial<Device>): Device {
    const updatedDeviceIndex = this.devices.findIndex(
      (foundDevice) => (foundDevice.serial = device.serial)
    );
    this.devices[updatedDeviceIndex] = {
      ...this.devices[updatedDeviceIndex],
      ...device,
    };
    return {} as Device;
  }
}
