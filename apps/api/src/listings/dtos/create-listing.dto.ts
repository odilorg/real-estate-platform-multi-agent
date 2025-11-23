import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  Min,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, DealType } from '@prisma/client';

class LocalizedText {
  @ApiPropertyOptional({ example: 'Beautiful apartment in city center' })
  @IsOptional()
  @IsString()
  en?: string;

  @ApiPropertyOptional({ example: 'Красивая квартира в центре города' })
  @IsOptional()
  @IsString()
  ru?: string;

  @ApiPropertyOptional({ example: "Shahar markazidagi chiroyli kvartira" })
  @IsOptional()
  @IsString()
  uz?: string;
}

export class CreateListingDto {
  @ApiProperty({
    enum: PropertyType,
    example: PropertyType.APARTMENT,
    description: 'Type of property',
  })
  @IsEnum(PropertyType)
  @IsNotEmpty()
  propertyType: PropertyType;

  @ApiProperty({
    enum: DealType,
    example: DealType.SALE,
    description: 'Type of deal',
  })
  @IsEnum(DealType)
  @IsNotEmpty()
  dealType: DealType;

  @ApiProperty({
    type: LocalizedText,
    description: 'Localized title',
    example: {
      en: 'Beautiful apartment in city center',
      ru: 'Красивая квартира в центре города',
      uz: "Shahar markazidagi chiroyli kvartira",
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedText)
  title: LocalizedText;

  @ApiProperty({
    type: LocalizedText,
    description: 'Localized description',
    example: {
      en: 'Spacious 2-bedroom apartment with modern amenities',
      ru: 'Просторная 2-комнатная квартира с современными удобствами',
      uz: '2 xonali keng kvartira zamonaviy qulayliklar bilan',
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedText)
  description: LocalizedText;

  @ApiProperty({ example: 'Tashkent', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Yunusabad', description: 'District name' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    example: '123 Main Street, Building 5',
    description: 'Full address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 41.2995, description: 'Latitude coordinate' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 69.2401, description: 'Longitude coordinate' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 150000, description: 'Price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'USD',
    default: 'UZS',
    description: 'Currency code',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 85.5, description: 'Area in square meters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({ example: 3, description: 'Total number of rooms' })
  @IsOptional()
  @IsInt()
  @Min(0)
  rooms?: number;

  @ApiPropertyOptional({ example: 2, description: 'Number of bedrooms' })
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 1, description: 'Number of bathrooms' })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 5, description: 'Floor number' })
  @IsOptional()
  @IsInt()
  @Min(0)
  floor?: number;

  @ApiPropertyOptional({ example: 9, description: 'Total floors in building' })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalFloors?: number;

  @ApiPropertyOptional({
    type: 'object',
    example: {
      hasParking: true,
      hasElevator: true,
      hasSecurity: false,
      petFriendly: false,
    },
    description: 'Additional features as JSON object',
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;
}
