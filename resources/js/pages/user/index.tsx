import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type UserInformation = {
    id: number;
    user_id: number;
    uuid: string;
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
    user: {
        id: number;
        username: string;
        email: string;
        uuid: string;
    };
};

type Props = {
    user: UserInformation[];
};

function getInitials(first: string, last: string) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function Index({ user }: Props) {
    console.log(user)
    return (
        <>
            <Head title="Profile" />

            <div className="p-4">
                {user.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No other user found.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {user.map((info) => (
                            <div
                                key={info.id}
                                className="flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
                            >
                                {/* "Product image" area — avatar/initials banner */}
                                <div className="flex h-32 items-center justify-center bg-olive-500">
                                    <span className="text-3xl font-semibold text-white">
                                        {getInitials(info.first_name, info.last_name)}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <div>
                                        <h2 className="text-base font-medium">
                                            {info.first_name} {info.last_name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            @{info.user.username}
                                        </p>
                                    </div>

                                    <dl className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                                        {info.city && (
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    {[info.city, info.region].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {info.contact_no && (
                                            <div className="flex items-center gap-1">
                                                <span>{info.contact_no}</span>
                                            </div>
                                        )}
                                    </dl>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="mt-auto w-full"
                                    >
                                        <Link href={`/profiles/${info.user.uuid}`}>
                                            View profile
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}