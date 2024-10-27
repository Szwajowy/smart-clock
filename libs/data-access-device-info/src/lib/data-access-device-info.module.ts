import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceInfoRepository } from './repositories/device-info.repository';
import { DeviceInfo } from './entities/device-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceInfo])],
  providers: [DeviceInfoRepository],
  exports: [DeviceInfoRepository, TypeOrmModule],
})
export class DataAccessDeviceInfoModule {}
