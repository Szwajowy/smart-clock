import { Module } from '@nestjs/common';

import { DevicesModule } from './modules/devices/devices.module';

@Module({
  imports: [DevicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
