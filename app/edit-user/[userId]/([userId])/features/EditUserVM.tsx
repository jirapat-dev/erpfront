import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { UpdateUserRequest, UserRole } from '@/types/user'

import {
  useUserDetail,
  useUpdateUser,
} from "@/hooks/useUser";

export const EditUserVM = () => {
    const updateUserMutation = useUpdateUser();
    const { userId } = useParams<{
        userId: string;
    }>();

    const updateUserSchema = z.object({
        username: z
            .string()
            .trim()
            .min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร")
            .max(100, "Username ต้องไม่เกิน 100 ตัวอักษร"),

        email: z
            .email("รูปแบบ Email ไม่ถูกต้อง")
            .max(255, "Email ต้องไม่เกิน 255 ตัวอักษร"),

        firstName: z
            .string()
            .max(100)
            .optional()
            .or(z.literal("")),

        lastName: z
            .string()
            .max(100)
            .optional()
            .or(z.literal("")),
        });

    type UpdateUserFormData = z.infer<typeof updateUserSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
    });

    const {
        data: user,
        isLoading,
    } = useUserDetail(userId);

    const onSubmit = async (
        data: UpdateUserFormData
    ) => {
        if(!userId){
            return;
        }

        const payload: UpdateUserRequest = {
            id: userId,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email,
            role: UserRole.USER,
        }

        await updateUserMutation.mutateAsync(payload);
    };

    useEffect(() => {
        if (user) {
            reset({
            username: user.username,
            email: user.email,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            });
        }
    }, [user, reset]);

    return {
        handleSubmit,
        onSubmit,
        register,
        errors,
        user,
        isLoading
    }
}