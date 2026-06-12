import { useParams } from "next/navigation";

import { useUserDetail } from '@/hooks/useUser'

export const PersonalInfoVM = () => {
    const { userId } = useParams<{
        userId: string;
    }>();

    const {
        data: user,
        isLoading,
        error,
    } = useUserDetail(userId);

    return {
        isLoading, 
        error, 
        user
    }
}