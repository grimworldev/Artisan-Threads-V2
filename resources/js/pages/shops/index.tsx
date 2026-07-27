import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type Shop = {
    id: number;
    uuid: string;
    business_name: string;
    business_description: string | null;
    logo_path: string | null;
    logo_url?: string | null;
    region: string | null;
    city: string | null;
    barangay: string | null;
    address: string | null;
    contact_no: string | null;
    status: number;
    user: {
        id: number;
        username: string;
        uuid: string;
    };
};

type Props = {
    shops: Shop[];
};

function getInitials(businessName: string) {
    const words = businessName.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export default function Index({ shops }: Props) {
    return (
        <>
            <Head title="Businesses" />

            <div className="p-4">
                {shops.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No businesses found.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {shops.map((shop) => (
                            <div
                                key={shop.id}
                                className="flex flex-col gap-3 rounded-lg border bg-background p-4 transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Business logo — small square, profile-picture style */}
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-olive-500">
                                        {shop.logo_url ? (
                                            <img
                                                src={shop.logo_url}
                                                alt={shop.business_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="text-lg font-semibold text-white">
                                                    {getInitials(shop.business_name)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <h2 className="text-base font-medium">
                                            {shop.business_name}
                                        </h2>
                                        {shop.contact_no && (
                                            <p className="text-sm text-muted-foreground">
                                                {shop.contact_no}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-auto w-full"
                                >
                                    <Link href={`/shops/${shop.uuid}`}>
                                        View business
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}