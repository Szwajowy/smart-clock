import { Module } from '@nestjs/common';

import { DataAccessDeviceInfoModule } from 'data-access-device-info';
import { DeviceService } from './services/device.service';

@Module({
  imports: [DataAccessDeviceInfoModule],
  controllers: [],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class BusinessLogicDeviceModule {}
