import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInfo } from '../entities/device-info.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceInfoRepository {
  constructor(
    @InjectRepository(DeviceInfo)
    private deviceInfoRepository: Repository<DeviceInfo>
  ) {}

  findAll(): Promise<DeviceInfo[]> {
    return this.deviceInfoRepository.find();
  }

  async findOne(serial: string): Promise<DeviceInfo> {
    const deviceInfo = await this.deviceInfoRepository.findOneBy({ serial });
    if (!deviceInfo)
      throw new NotFoundException(
        `Device info with "${serial}" id was not found.`
      );

    return deviceInfo;
  }

  async create(deviceInfo: DeviceInfo): Promise<DeviceInfo> {
    const foundDeviceInfo = await this.deviceInfoRepository.findOneBy({
      serial: deviceInfo.serial,
    });
    if (foundDeviceInfo) {
      throw new HttpException(
        'Device info with this serial already exists',
        HttpStatus.BAD_REQUEST
      );
    }

    const newDeviceInfo = this.deviceInfoRepository.create(deviceInfo);
    return this.deviceInfoRepository.save(newDeviceInfo);
  }

  async update(deviceInfo: Partial<DeviceInfo>): Promise<DeviceInfo> {
    const updatedDeviceInfo = await this.deviceInfoRepository.preload(
      deviceInfo
    );

    if (updatedDeviceInfo === undefined) {
      throw new NotFoundException(
        `Device info with "${deviceInfo.serial}" id was not found.`
      );
    }

    return this.deviceInfoRepository.save(updatedDeviceInfo);
  }
}
