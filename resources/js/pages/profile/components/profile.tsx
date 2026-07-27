type ProfileHeaderUser = {
    username: string;
    avatar_url?: string | null;
    cover_url?: string | null;
};

type ProfileHeaderProps = {
    user: ProfileHeaderUser;
    fullName: string;
    initials: string;
};

export function ProfileHeader({ user, fullName, initials }: ProfileHeaderProps) {
    return (
        <div className="overflow-hidden rounded-lg border">
            {/* Banner - read only, no upload controls */}
            <div className="relative h-32 w-full bg-olive-500 sm:h-40">
                {user.cover_url && (
                    <img
                        src={user.cover_url}
                        alt="Cover photo"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="px-4 py-4">
                <div className="-mt-8 flex flex-col items-center gap-3 sm:-mt-10 sm:flex-row sm:items-end">
                    <div className="relative z-20 h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-background bg-slate-200 text-lg font-semibold shadow-md sm:h-20 sm:w-20 dark:bg-slate-700">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={fullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-slate-600 dark:text-slate-200">
                                {initials}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center pb-1 text-center sm:items-start sm:text-left">
                        <h1 className="text-base font-semibold">{fullName}</h1>
                        <p className="text-xs text-muted-foreground">
                            @{user.username}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}