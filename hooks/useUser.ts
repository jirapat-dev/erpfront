import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { userService } from "@/services/user/user.service";

export const useUserDetail = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => userService.getUserDetail(userId),
        enabled: !!userId,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.createUser,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.updateUser,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["user", data.id],
            });
        },
    });
};