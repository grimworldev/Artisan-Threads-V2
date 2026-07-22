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
};

type Props = {
    user: User;
};

export default function Show({ user }: Props) {
    return (
        <>
            <Head title="Profile" />

            <div className="flex flex-col gap-6 p-4">
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