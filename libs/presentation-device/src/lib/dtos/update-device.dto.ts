import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends CreateDeviceDto {
  override serial!: string;
}
