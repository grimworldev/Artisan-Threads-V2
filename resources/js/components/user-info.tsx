import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    return (
        <>
            <div className="grid flex-1 text-left text-sm leading-tight px-4">
                    <span className="truncate text-xs text-muted-foreground">
                        @{user.username}
                    </span>
                    <span className="truncate text-xs text-muted-foreground font-bold">
                        {user.email}
                    </span>
            </div>
        </>
    );
}
