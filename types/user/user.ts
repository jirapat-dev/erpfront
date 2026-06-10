export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UpdateUserRequest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}