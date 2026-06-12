"use client";

import { PersonalInfoVM } from './PersonalInfoVM';

export const PersonalInfo = () => {
    const { user, isLoading, error } = PersonalInfoVM();

    if(isLoading){
        return (
            <div className='flex flex-1 h-full'>
                <div className='text-white'>Loading...</div>
            </div>
        );
    }

    if(error){
        return (
            <div className='flex flex-1 h-full'>
                <div className='text-red-500'>Error</div>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            <div className='flex gap-[4px]'>
                <div className='text-[14px] font-500'>Username: </div>
                <div className='text-[14px]'>{user?.username}</div>
            </div>

            <div className='flex gap-[4px]'>
                <div className='text-[14px] font-500'>Email: </div>
                <div className='text-[14px]'>{user?.email}</div>
            </div>

            <div className='flex gap-[4px]'>
                <div className='text-[14px] font-500'>First Name: </div>
                <div className='text-[14px]'>{user?.firstName}</div>
            </div>

            
            <div className='flex gap-[4px]'>
                <div className='text-[14px] font-500'>Last Name: </div>
                <div className='text-[14px]'>{user?.lastName}</div>
            </div>
        </div>
    );
}