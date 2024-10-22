import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  serial: string;
}
