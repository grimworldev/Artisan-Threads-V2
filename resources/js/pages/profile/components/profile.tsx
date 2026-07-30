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
            <div className="group relative aspect-[3/1] w-full bg-olive-500">
                {user.cover_url && (
                    <img
                        src={user.cover_url}
                        alt="Cover photo"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="px-4 py-4">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
                    <div className="relative z-20 -mt-10 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-slate-200 text-xl font-semibold shadow-md sm:-mt-16 sm:h-32 sm:w-32 dark:bg-slate-700">
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

                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                        <h1 className="text-lg font-semibold sm:text-xl">{fullName}</h1>
                        <p className="text-sm text-muted-foreground">
                            @{user.username}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}