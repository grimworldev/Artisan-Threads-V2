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
                                            {product.shop.business_name}
                                        </p>
                                    </div>

                                    <dl className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
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