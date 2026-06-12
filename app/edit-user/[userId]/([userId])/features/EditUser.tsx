"use client";

import { EditUserVM } from './EditUserVM';

export const EditUser = () => {
    const { register, errors, handleSubmit, onSubmit } = EditUserVM();
    
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
                <label>First Name</label>

                <input
                {...register("firstName")}
                className="border p-2 w-full"
                />

                {errors.firstName && (
                <p>{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label>Last Name</label>

                <input
                {...register("lastName")}
                className="border p-2 w-full"
                />

                {errors.lastName && (
                <p>{errors.lastName.message}</p>
                )}
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                type="button"
                onClick={handleSubmit(onSubmit)}
            >
                Save
            </button>
        </div>
    );
}