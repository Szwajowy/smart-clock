import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import { Device } from '../interfaces/device.interface';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { UpdateDeviceDto } from '../dtos/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  getDevices(): Device[] {
    return this.devicesService.getDevices();
  }

  @Get('/:id')
  getDevice(@Param('id') id: string): Device {
    const device = this.devicesService.getDevice(id);

    if (!device)
      throw new NotFoundException(`Device with id "${id}" was not found.`);

    return device;
  }

  @Post()
  createDevice(@Body() createDeviceDto: CreateDeviceDto): Device {
    const newDevice: Device = {
      serial: createDeviceDto.serial,
    };

    return this.devicesService.createDevice(newDevice);
  }

  @Patch()
  updateDevice(@Body() updateDeviceDto: UpdateDeviceDto): Device {
    return this.devicesService.updateDevice(updateDeviceDto);
  }
}
