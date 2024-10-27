import { Module } from '@nestjs/common';
import { BusinessLogicDeviceModule } from 'business-logic-device';
import { DevicesController } from './controllers/devices.controller';

@Module({
  imports: [BusinessLogicDeviceModule],
  controllers: [DevicesController],
  providers: [],
  exports: [],
})
export class PresentationDeviceModule {}
