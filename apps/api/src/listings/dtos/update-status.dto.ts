import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ListingStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ListingStatus,
    example: ListingStatus.ACTIVE,
    description: 'New status for the listing',
  })
  @IsEnum(ListingStatus)
  @IsNotEmpty()
  status: ListingStatus;
}
