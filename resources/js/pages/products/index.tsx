// resources/js/Pages/products/index.tsx
import { Head, Link } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { show as showProduct } from '@/routes/products';

interface ProductImage {
    id: number;
    image_url: string;
    is_primary: boolean;
}

interface Shop {
    uuid: string;
    business_name: string;
}

interface Product {
    uuid: string;
    product_name: string;
    price: string;
    quantity: number;
    status: number;
    primary_image: ProductImage | null;
    shop: Shop;
}

interface Props {
    products: Product[];
}

function formatPrice(price: string): string {
    const value = Number(price);
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

export default function Index({ products }: Props) {
    return (
        <>
            <Head title="Products" />

            <div className="p-4">
                {products.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No products yet.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => (
                            <div
                                key={product.uuid}
                                className="flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-mdd"
                            >
                                <div className="aspect-square w-full overflow-hidden bg-muted">
                                    {product.primary_image ? (
                                        <img
                                            src={product.primary_image.image_url}
                                            alt={product.product_name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                                    <div>
                                        <h2 className="text-sm font-medium sm:text-base capitalize">
                                            {product.product_name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {product.shop.business_name}
                                        </p>
                                    </div>

                                    <dl className="text-xs font-semibold text-muted-foreground sm:text-sm">
                                        <div className="flex items-center gap-1">
                                            <span>{formatPrice(product.price)}</span>
                                        </div>
                                        {product.quantity === 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-destructive">
                                                    Out of stock
                                                </span>
                                            </div>
                                        )}
                                    </dl>

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
                )}
            </div>
        </>
    );
}

Index.layout = {
    title: 'Products',
    description: 'Browse products',
};