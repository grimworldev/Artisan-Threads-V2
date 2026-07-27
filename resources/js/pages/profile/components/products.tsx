// resources/js/Pages/profile/components/products.tsx
import { Link } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { show as showProduct, create as createProduct } from '@/routes/products';

type ProductImage = {
    id: number;
    image_url: string;
    is_primary: boolean;
};

type Product = {
    uuid: string;
    product_name: string;
    price: string;
    quantity: number;
    status: number;
    primary_image: ProductImage | null;
};

type Props = {
    products: Product[];
    isOwner?: boolean;
};

function formatPrice(price: string): string {
    const value = Number(price);
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

export function Products({ products, isOwner = false }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <Package className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No products yet.</p>
                {isOwner && (
                    <Button asChild variant="outline" size="sm">
                        <Link href={createProduct.url()}>
                            <Plus className="h-4 w-4" />
                            Add product
                        </Link>
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {isOwner && (
                <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                        <Link href={createProduct.url()}>
                            <Plus className="h-4 w-4" />
                            Add product
                        </Link>
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.uuid}
                        className="flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
                    >
                        <div className="flex h-32 items-center justify-center bg-muted">
                            {product.primary_image ? (
                                <img
                                    src={product.primary_image.image_url}
                                    alt={product.product_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex flex-1 flex-col gap-2 p-4">
                            <div>
                                <h2 className="text-base font-medium capitalize">
                                    {product.product_name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {formatPrice(product.price)}
                                </p>
                            </div>

                            {product.quantity === 0 && (
                                <span className="text-xs text-destructive">
                                    Out of stock
                                </span>
                            )}

                            <Button
                                asChild
                                variant="outline"
                                className="mt-auto w-full"
                            >
                                <Link href={showProduct.url(product.uuid)}>
                                    View
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}