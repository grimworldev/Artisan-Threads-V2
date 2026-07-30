import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export type ProductImage = {
    id: number;
    image_path: string;
    image_url: string;
    is_primary: boolean;
};

export type Product = {
    id: number;
    uuid: string;
    product_name: string;
    product_description: string | null;
    price: number;
    quantity: number;
    primary_image: ProductImage | null;
};

type Props = {
    products: Product[];
    shopUuid: string;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(price);
}

export function ProductList({ products, shopUuid }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <Package className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No products listed yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
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
                            <h3 className="text-sm font-medium sm:text-base capitalize">
                                {product.product_name}
                            </h3>
                            <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {product.quantity <= 0 && (
                            <span className="w-fit rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-950 dark:text-red-400 sm:text-xs">
                                Out of stock
                            </span>
                        )}

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mt-auto w-full text-xs sm:text-sm"
                        >
                            <Link href={`/shops/products/${product.uuid}`}>
                                View
                            </Link>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}