import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ListingOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const listingId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins can access any listing
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check if listing exists and user is the owner
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { ownerId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to modify this listing',
      );
    }

    return true;
  }
}
