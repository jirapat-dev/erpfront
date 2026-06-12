import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateUserRequest, UserRole } from '@/types/user'

import { useCreateUser } from '@/hooks/useUser'

export const CreateUserVM = () => {
    const createUserMutation = useCreateUser();

    const createUserSchema = z.object({
        username: z
            .string()
            .trim()
            .min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร")
            .max(100, "Username ต้องไม่เกิน 100 ตัวอักษร"),

        email: z
            .email("รูปแบบ Email ไม่ถูกต้อง")
            .max(255, "Email ต้องไม่เกิน 255 ตัวอักษร"),

        password: z
            .string()
            .min(8, "Password ต้องมีอย่างน้อย 8 ตัวอักษร")
            .max(255),

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

    type CreateUserFormData = z.infer<typeof createUserSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
    });

    const onSubmit = async (
        data: CreateUserFormData
    ) => {
        const payload: CreateUserRequest = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email,
            username: data.username,
            password: data.password,
            role: UserRole.USER,
        }

        await createUserMutation.mutateAsync(payload);
    };

    return {
        handleSubmit,
        onSubmit,
        register,
        errors
    }
}