import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DevicesService } from '../services/devices.service';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { UpdateDeviceDto } from '../dtos/update-device.dto';
import { Device } from '../entities/device.entity';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  getDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Get('/:id')
  getDevice(@Param('id') id: string): Promise<Device> {
    return this.devicesService.findOne(id);
  }

  @Post()
  createDevice(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    const newDevice = {
      serial: createDeviceDto.serial,
    } as Device;

    return this.devicesService.create(newDevice);
  }

  @Patch()
  updateDevice(@Body() updateDeviceDto: UpdateDeviceDto): Device {
    return this.devicesService.update(updateDeviceDto);
  }
}
