export interface User {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    role: UserRole
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export interface CreateUserRequest {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    username: string;
    password: string;
    bio?: string | null;
    avatarUrl?: string | null;
    role: UserRole
}

export interface UpdateUserRequest {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    bio?: string | null;
    avatarUrl?: string | null;
    role: UserRole
}