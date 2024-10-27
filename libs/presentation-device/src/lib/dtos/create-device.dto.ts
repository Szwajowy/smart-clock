import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    example: '4214512d25s3',
  })
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  serial!: string;
}
