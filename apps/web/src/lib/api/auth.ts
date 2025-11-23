/**
 * Auth API functions for authentication operations
 */

import { api } from '../api-client';
import type {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  AuthResponse,
  ProfileResponse,
} from '@real-estate/shared';

/**
 * Register a new user
 */
export async function register(data: RegisterDto): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', data);
}

/**
 * Login with email and password
 */
export async function login(data: LoginDto): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', data);
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  return api.post<void>('/auth/logout');
}

/**
 * Get current user profile
 */
export async function getMe(): Promise<ProfileResponse> {
  return api.get<ProfileResponse>('/auth/me');
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: UpdateProfileDto
): Promise<ProfileResponse> {
  return api.patch<ProfileResponse>('/auth/profile', data);
}
