import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

type UserInformation = {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    gender: string | null;
    birthdate: string | null;
    region: string | null;
    city: string | null;
    barangay: string | null;
    address: string | null;
    contact_no: string | null;
};

type User = {
    id: number;
    username: string;
    email: string;
    information: UserInformation | null;
    avatar_url?: string | null;
    cover_url?: string | null;
};

type Props = {
    user: User;
};

function getInitials(user: User) {
    if (user.information) {
        const { first_name, last_name } = user.information;
        return `${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() ?? '?';
}

export default function Show({ user }: Props) {
    const fullName = user.information
        ? [user.information.first_name, user.information.last_name].filter(Boolean).join(' ')
        : user.username;

    return (
        <>
            <Head title={fullName} />

            <div className="my-10 flex flex-col gap-6">
                <div className="overflow-hidden rounded-lg border">
                    {/* Banner — no menu, no upload, just display */}
                    <div className="relative h-48 w-full bg-olive-500 sm:h-64">
                        {user.cover_url && (
                            <img
                                src={user.cover_url}
                                alt="Cover photo"
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                            {/* Avatar — plain div, no button/click/hover overlay */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-slate-200 text-2xl font-semibold shadow-md sm:h-32 sm:w-32 dark:bg-slate-700">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-slate-600 dark:text-slate-200">
                                        {getInitials(user)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col items-center pb-1 text-center sm:items-start sm:text-left">
                                <h1 className="text-xl font-semibold">{fullName}</h1>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-lg border p-6">
                        <h2 className="mb-4 text-lg font-medium">Account</h2>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Username</dt>
                                <dd>{user.username}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                        </dl>
                    </div>

                    {user.information && (
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-lg font-medium">Personal Information</h2>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">First name</dt>
                                    <dd>{user.information.first_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Last name</dt>
                                    <dd>{user.information.last_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Middle name</dt>
                                    <dd>{user.information.middle_name ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Gender</dt>
                                    <dd>{user.information.gender ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Birthdate</dt>
                                    <dd>{user.information.birthdate ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Contact no.</dt>
                                    <dd>{user.information.contact_no ?? '—'}</dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-muted-foreground">Address</dt>
                                    <dd>
                                        {[user.information.address, user.information.barangay, user.information.city, user.information.region]
                                            .filter(Boolean)
                                            .join(', ') || '—'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Once UserDocuments and Shops relations are ready, add similar
                        <div className="rounded-lg border p-6"> blocks for each here. */}
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Profile',
            href: dashboard(),
        },
    ],
};