import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { ProductList, type Product } from './components/product-list';

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
    shops: Shop;
    products: Product[];
};

function getInitials(businessName: string) {
    const words = businessName.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export default function Show({ shops, products }: Props) {
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    const isVerified = shops.status === 1;

    const fullAddress = [shops.address, shops.barangay, shops.city, shops.region]
        .filter(Boolean)
        .join(', ');

    const details = [shops.contact_no, fullAddress].filter(Boolean).join(' • ');

    return (
        <>
            <Head title={shops.business_name} />

            <div className="my-6 flex flex-col gap-4">
                <div className="overflow-hidden rounded-lg border">
                    <div className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:items-start sm:text-left">
                        {/* Logo — square, profile-picture style */}
                        <div className="h-24 w-24 md:w-60 md:h-60 shrink-0 overflow-hidden rounded-lg bg-olive-500 sm:h-28 sm:w-28">
                            {shops.logo_url ? (
                                <img
                                    src={shops.logo_url}
                                    alt={shops.business_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-2xl font-semibold text-white">
                                        {/* {getInitials(shops.business_name)} */}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                                <h1 className="text-xl font-semibold">
                                    {shops.business_name}
                                </h1>
                                {isVerified && (
                                    <BadgeCheck
                                        className="h-6 w-6 shrink-0 fill-blue-500 text-background"
                                        aria-label="Verified"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                {shops.business_description && (
                                    <div>
                                        <h2 className="mb-1 text-sm font-medium">
                                            About Us
                                        </h2>
                                        <p
                                            className={`text-sm whitespace-pre-line text-muted-foreground text-left ${descriptionExpanded
                                                    ? ''
                                                    : 'line-clamp-3 sm:line-clamp-none'
                                                }`}
                                        >
                                            {shops.business_description}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDescriptionExpanded(
                                                    (expanded) => !expanded,
                                                )
                                            }
                                            className="mt-1 cursor-pointer text-xs font-medium text-blue-500 hover:underline md:hidden"
                                        >
                                            {descriptionExpanded
                                                ? 'See less'
                                                : 'See more'}
                                        </button>
                                    </div>
                                )}

                                <p className="text-sm text-muted-foreground font-bold mt-2">
                                    {details || '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-medium">Products</h2>
                    <ProductList products={products} shopUuid={shops.uuid} />
                </div>
            </div>
        </>
    );
}