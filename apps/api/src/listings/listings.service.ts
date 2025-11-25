import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dtos/create-listing.dto';
import { UpdateListingDto } from './dtos/update-listing.dto';
import { QueryListingDto } from './dtos/query-listing.dto';
import { ListingStatus } from '@real-estate/shared';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateListingDto) {
    const titleJson = JSON.stringify(dto.title);
    const descriptionJson = JSON.stringify(dto.description);
    const featuresJson = dto.features ? JSON.stringify(dto.features) : null;

    const listing = await this.prisma.listing.create({
      data: {
        ownerId,
        propertyType: dto.propertyType,
        dealType: dto.dealType,
        status: ListingStatus.DRAFT,
        title: titleJson,
        description: descriptionJson,
        city: dto.city,
        district: dto.district,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        price: dto.price,
        currency: dto.currency || 'UZS',
        area: dto.area,
        rooms: dto.rooms,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        floor: dto.floor,
        totalFloors: dto.totalFloors,
        features: featuresJson,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return this.formatListing(listing);
  }

  async findAll(queryDto: QueryListingDto) {
    const {
      page = 1,
      limit = 20,
      propertyType,
      dealType,
      status,
      city,
      district,
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      minArea,
      maxArea,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ownerId,
    } = queryDto;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    } else {
      where.status = ListingStatus.ACTIVE;
    }

    if (propertyType) where.propertyType = propertyType;
    if (dealType) where.dealType = dealType;
    if (city) where.city = city;
    if (district) where.district = district;
    if (ownerId) where.ownerId = ownerId;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minRooms !== undefined || maxRooms !== undefined) {
      where.rooms = {};
      if (minRooms !== undefined) where.rooms.gte = minRooms;
      if (maxRooms !== undefined) where.rooms.lte = maxRooms;
    }

    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {};
      if (minArea !== undefined) where.area.gte = minArea;
      if (maxArea !== undefined) where.area.lte = maxArea;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    const formattedListings = listings.map((listing) =>
      this.formatListing(listing),
    );

    return {
      data: formattedListings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    this.prisma.listing
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((error) => {
        console.error('Failed to increment view count:', error);
      });

    return this.formatListing(listing);
  }

  async update(id: string, ownerId: string, dto: UpdateListingDto) {
    const existingListing = await this.prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existingListing) {
      throw new NotFoundException('Listing not found');
    }

    if (existingListing.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to update this listing',
      );
    }

    const updateData: any = {};

    if (dto.propertyType !== undefined)
      updateData.propertyType = dto.propertyType;
    if (dto.dealType !== undefined) updateData.dealType = dto.dealType;
    if (dto.title !== undefined) updateData.title = JSON.stringify(dto.title);
    if (dto.description !== undefined)
      updateData.description = JSON.stringify(dto.description);
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.district !== undefined) updateData.district = dto.district;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.area !== undefined) updateData.area = dto.area;
    if (dto.rooms !== undefined) updateData.rooms = dto.rooms;
    if (dto.bedrooms !== undefined) updateData.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) updateData.bathrooms = dto.bathrooms;
    if (dto.floor !== undefined) updateData.floor = dto.floor;
    if (dto.totalFloors !== undefined)
      updateData.totalFloors = dto.totalFloors;
    if (dto.features !== undefined)
      updateData.features = JSON.stringify(dto.features);

    const listing = await this.prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return this.formatListing(listing);
  }

  async remove(id: string, ownerId: string) {
    const existingListing = await this.prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existingListing) {
      throw new NotFoundException('Listing not found');
    }

    if (existingListing.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to delete this listing',
      );
    }

    await this.prisma.listing.delete({
      where: { id },
    });

    return { message: 'Listing deleted successfully' };
  }

  async updateStatus(id: string, status: ListingStatus) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: {
        status,
        publishedAt:
          status === ListingStatus.ACTIVE && !listing.publishedAt
            ? new Date()
            : listing.publishedAt,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return this.formatListing(updatedListing);
  }

  async uploadImage(
    listingId: string,
    imageData: { url: string; order: number },
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const image = await this.prisma.listingImage.create({
      data: {
        listingId,
        url: imageData.url,
        order: imageData.order,
      },
    });

    return image;
  }

  async deleteImage(imageId: string, userId: string) {
    const image = await this.prisma.listingImage.findUnique({
      where: { id: imageId },
      include: {
        listing: {
          select: { ownerId: true },
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.listing.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this image',
      );
    }

    await this.prisma.listingImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }

  private formatListing(listing: any) {
    return {
      ...listing,
      title: listing.title ? JSON.parse(listing.title) : null,
      description: listing.description
        ? JSON.parse(listing.description)
        : null,
      features: listing.features ? JSON.parse(listing.features) : null,
    };
  }
}
