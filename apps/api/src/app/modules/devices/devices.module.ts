import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Device } from './entities/device.entity';
import { DevicesController } from './controllers/devices.controller';
import { DevicesService } from './services/devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
