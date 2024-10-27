import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateDeviceDto } from '../dtos/create-device.dto';
import { UpdateDeviceDto } from '../dtos/update-device.dto';
import { DeviceService, Device } from 'business-logic-device';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  getDevices(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('/:id')
  getDevice(@Param('id') id: string): Promise<Device> {
    return this.deviceService.findOne(id);
  }

  @Post()
  createDevice(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    const newDevice = {
      serial: createDeviceDto.serial,
    } as Device;

    return this.deviceService.create(newDevice);
  }

  @Patch()
  updateDevice(@Body() updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    return this.deviceService.update(updateDeviceDto);
  }
}
