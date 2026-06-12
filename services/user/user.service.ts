import { api } from "@/lib/axios";
import {
    User,
    CreateUserRequest,
    UpdateUserRequest,
} from "@/types/user";

export const userService = {
    getUserDetail: async (userId: string): Promise<User> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    createUser: async (
        payload: CreateUserRequest
    ): Promise<User> => {
        const response = await api.post("/users", payload);
        return response.data;
    },

    updateUser: async (
        payload: UpdateUserRequest
    ): Promise<User> => {
        const response = await api.post(
            `/users/${payload.id}`,
            payload
        );

        return response.data;
    },
};