import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dtos';
import { Public, CurrentUser } from './decorators';
import { JwtAuthGuard } from './guards';
import { AuthResponse, ProfileResponse, User } from '@real-estate/shared';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    try {
      const user = await this.authService.register(dto);
      return {
        success: true,
        data: { user },
        message: 'User registered successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Registration failed',
      };
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    try {
      const { user, accessToken } = await this.authService.login(dto);

      // Set HTTP-only cookie with JWT token
      response.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: this.getMaxAgeFromExpiry(),
      });

      return {
        success: true,
        data: { user },
        message: 'Login successful',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Login failed',
      };
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiBearerAuth()
  async logout(@Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    // Clear the access token cookie
    response.clearCookie('access_token');

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async getCurrentUser(@CurrentUser() user: User): Promise<ProfileResponse> {
    return {
      success: true,
      data: { user },
    };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    try {
      const user = await this.authService.updateProfile(userId, dto);
      return {
        success: true,
        data: { user },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Profile update failed',
      };
    }
  }

  /**
   * Get max age in milliseconds from JWT_ACCESS_EXPIRY env variable
   * Default: 15 minutes (900000ms)
   */
  private getMaxAgeFromExpiry(): number {
    const expiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    const match = expiry.match(/^(\d+)([smhd])$/);

    if (!match) {
      return 15 * 60 * 1000; // 15 minutes default
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || 1000);
  }
}
