import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dtos/create-listing.dto';
import { UpdateListingDto } from './dtos/update-listing.dto';
import { QueryListingDto } from './dtos/query-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ListingOwnershipGuard } from './guards/listing-ownership.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ListingStatus } from '@real-estate/shared';

@Controller('listings')
@ApiTags('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(userId, createListingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated listings' })
  findAll(@Query() queryDto: QueryListingDto) {
    return this.listingsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single listing by ID' })
  @ApiResponse({ status: 200, description: 'Returns the listing' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ListingOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, userId, updateListingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ListingOwnershipGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a listing' })
  @ApiResponse({ status: 204, description: 'Listing deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.listingsService.remove(id, userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ListingStatus,
  ) {
    return this.listingsService.updateStatus(id, status);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image to a listing' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  uploadImage(
    @Param('id') listingId: string,
    @Body('url') url: string,
    @Body('order') order: number,
  ) {
    return this.listingsService.uploadImage(listingId, { url, order });
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an image from a listing' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  deleteImage(
    @Param('imageId') imageId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.listingsService.deleteImage(imageId, userId);
  }
}
