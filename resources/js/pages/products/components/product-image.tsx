import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

type ProductImage = {
    id: number;
    image_path: string;
    image_url: string;
    is_primary: boolean;
};

type Props = {
    images: ProductImage[];
    productName: string;
};

export function ImageGallery({ images, productName }: Props) {
    const sorted = [...images].sort(
        (a, b) => Number(b.is_primary) - Number(a.is_primary),
    );

    const [activeIndex, setActiveIndex] = useState(0);

    if (sorted.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
            </div>
        );
    }

    const active = sorted[activeIndex];

    const goPrev = () =>
        setActiveIndex((i) => (i === 0 ? sorted.length - 1 : i - 1));

    const goNext = () =>
        setActiveIndex((i) => (i === sorted.length - 1 ? 0 : i + 1));

    return (
        <div className="flex flex-col gap-3">
            <div className="group relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                <img
                    src={active.image_url}
                    alt={productName}
                    className="h-full w-full object-cover"
                />

                {sorted.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous image"
                            className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 shadow transition-opacity group-hover:opacity-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next image"
                            className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 shadow transition-opacity group-hover:opacity-100"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {sorted.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {sorted.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                                index === activeIndex
                                    ? 'border-primary'
                                    : 'border-transparent hover:border-muted-foreground/30'
                            }`}
                        >
                            <img
                                src={image.image_url}
                                alt={`${productName} ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}