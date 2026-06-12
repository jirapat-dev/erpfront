"use client";

import { CreateUserVM } from './CreateUserVM';

export const CreateUser = () => {
    const { register, errors, handleSubmit, onSubmit } = CreateUserVM();
    
    return (
        <div className="space-y-4">
            <div>
                <label>Username</label>

                <input
                {...register("username")}
                className="border p-2 w-full"
                />

                {errors.username && (
                <p>{errors.username.message}</p>
                )}
            </div>

            <div>
                <label>Email</label>

                <input
                {...register("email")}
                className="border p-2 w-full"
                />

                {errors.email && (
                <p>{errors.email.message}</p>
                )}
            </div>

            <div>
                <label>Password</label>

                <input
                type="password"
                {...register("password")}
                className="border p-2 w-full"
                />

                {errors.password && (
                <p>{errors.password.message}</p>
                )}
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"                type="button"
                onClick={handleSubmit(onSubmit)}
            >
                Save
            </button>
        </div>
    );
}