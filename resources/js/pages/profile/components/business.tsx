import { Link } from '@inertiajs/react';
import { Store, MapPin, Phone, BadgeCheck, BadgeX } from 'lucide-react';
import { useState } from 'react';

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
};

type Props = {
    shop: Shop | null;
    username: string;
    isOwner: boolean;
};

export function Business({ shop, username, isOwner }: Props) {
    const [descExpanded, setDescExpanded] = useState(false);

    if (!shop) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <Store className="h-8 w-8 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">
                        No business registered yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isOwner
                            ? 'Register your business to start selling on the platform.'
                            : "This user hasn't registered a business yet."}
                    </p>
                </div>
                {isOwner && (
                    <Link
                        href={`/profiles/${username}/business/registration`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Register Business
                    </Link>
                )}
            </div>
        );
    }

    const isVerified = shop.status === 1;

    return (
        <div className="rounded-lg border p-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
                {shop.logo_url ? (
                    <img
                        src={shop.logo_url}
                        alt={shop.business_name}
                        className="h-32 w-32 md:h-60 md:w-60 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <Store className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}
                <div>
                    <div className="mb-3 flex items-center gap-1.5">
                        <h3 className="text-lg md:text-2xl font-semibold">
                            {shop.business_name}
                        </h3>
                        {isVerified ? (
                            <span className="flex justify-center text-white bg-blue-400 px-2 py-1 rounded-full">
                                <BadgeCheck
                                    className="h-4 w-4 shrink-0"
                                    aria-label="Verified business"
                                />
                                <span className="text-xs font-medium text-left">Verified</span>
                            </span>
                        ) : (
                            <span className="flex justify-center text-muted-foreground">
                                <BadgeX
                                    className="h-4 w-4 shrink-0"
                                    aria-label="Unverified business"
                                />
                                <span className="text-xs font-medium">Unverified</span>
                            </span>
                        )}
                    </div>
                    {shop.business_description && (
                        <>
                            <p
                                className={`text-md text-muted-foreground ${descExpanded ? '' : 'line-clamp-2 md:line-clamp-none'
                                    }`}
                            >
                                {shop.business_description}
                            </p>
                            <button
                                type="button"
                                onClick={() => setDescExpanded((v) => !v)}
                                className="mt-1 cursor-pointer text-xs font-medium text-blue-500 hover:underline md:hidden"
                            >
                                {descExpanded ? 'See less' : 'See more'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-md">
                {shop.contact_no && (
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <dd>{shop.contact_no}</dd>
                    </div>
                )}
                {(shop.address ||
                    shop.barangay ||
                    shop.city ||
                    shop.region) && (
                        <div className="col-span-2 flex items-start gap-1.5">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <dd>
                                {[
                                    shop.address,
                                    shop.barangay,
                                    shop.city,
                                    shop.region,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </dd>
                        </div>
                    )}
            </dl>
        </div>
    );
}