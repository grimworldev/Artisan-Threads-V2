import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageGallery } from './components/product-image';
import { Package, Store, ChevronRight } from 'lucide-react';

type ProductImage = {
    id: number;
    image_path: string;
    image_url: string;
    is_primary: boolean;
};

type Shop = {
    id: number;
    uuid: string;
    business_name: string;
    logo_url?: string | null;
};

type Product = {
    id: number;
    uuid: string;
    product_name: string;
    product_description: string | null;
    category: string | null;
    price: number;
    quantity: number;
    status: number;
    images: ProductImage[];
    shop: Shop;
};

type Props = {
    product: Product;
};

const STATUS_REMOVED = 0;
const STATUS_ACTIVE = 1;
const STATUS_OUT_OF_STOCK = 2;

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(price);
}

function StockBadge({ status, quantity }: { status: number; quantity: number }) {
    if (status === STATUS_REMOVED) {
        return (
            <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                No longer available
            </span>
        );
    }

    if (status === STATUS_OUT_OF_STOCK || quantity <= 0) {
        return (
            <span className="w-fit rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
                Out of stock
            </span>
        );
    }

    if (quantity <= 10) {
        return (
            <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Only {quantity} left
            </span>
        );
    }

    return (
        <span className="w-fit rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
            In stock
        </span>
    );
}

export default function Index({ product }: Props) {
    const [quantity, setQuantity] = useState(1);

    const isPurchasable =
        product.status === STATUS_ACTIVE && product.quantity > 0;

    const maxQuantity = Math.max(product.quantity, 0);

    return (
        <>
            <Head title={product.product_name} />

            <div className="my-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ImageGallery
                    images={product.images}
                    productName={product.product_name}
                />

                <div className="flex flex-col gap-4">
                    {product.category && (
                        <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {product.category}
                        </span>
                    )}

                    <h1 className="text-xl font-semibold sm:text-2xl">
                        {product.product_name}
                    </h1>

                    <StockBadge
                        status={product.status}
                        quantity={product.quantity}
                    />

                    <p className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                    </p>

                    <Link
                        href={`/shops/${product.shop.uuid}`}
                        className="flex w-fit items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                            {product.shop.logo_url ? (
                                <img
                                    src={product.shop.logo_url}
                                    alt={product.shop.business_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Store className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {product.shop.business_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Visit shop
                            </span>
                        </div>
                        <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                    </Link>

                    {product.product_description && (
                        <div className="border-t pt-4">
                            <h2 className="mb-2 text-sm font-medium">
                                Description
                            </h2>
                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                {product.product_description}
                            </p>
                        </div>
                    )}

                    {isPurchasable && (
                        <div className="mt-2 flex flex-col gap-3 border-t pt-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">
                                    Quantity
                                </span>
                                <div className="flex items-center rounded-md border">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.max(1, q - 1),
                                            )
                                        }
                                        className="px-3 py-1 text-sm hover:bg-muted disabled:opacity-40"
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="min-w-10 border-x px-3 py-1 text-center text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(maxQuantity, q + 1),
                                            )
                                        }
                                        className="px-3 py-1 text-sm hover:bg-muted disabled:opacity-40"
                                        disabled={quantity >= maxQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {product.quantity} available
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1">
                                    Add to cart
                                </Button>
                                <Button className="flex-1">Buy now</Button>
                            </div>
                        </div>
                    )}

                    {!isPurchasable && (
                        <Button disabled className="mt-2 w-full">
                            <Package className="h-4 w-4" />
                            Unavailable
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}