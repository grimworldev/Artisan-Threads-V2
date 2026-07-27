import { ArrowLeft, Package } from 'lucide-react';

export function ProductBanner() {
    return (
        <div className="relative overflow-hidden rounded-xl border bg-linear-to-r from-olive-600 via-olive-500 to-stone-600 p-8 text-white my-6">
            <button
                type="button"
                onClick={() => window.history.back()}
                className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>
            <div className="max-w-2xl">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
                    <Package className="h-3.5 w-3.5" />
                    Product Listing
                </span>

                <h1 className="text-3xl font-bold md:text-4xl">
                    Showcase Your Product
                </h1>

                <p className="mt-3 max-w-xl text-sm text-blue-100 md:text-base">
                    Add your product's details and photos to reach more
                    buyers and start selling on our platform.
                </p>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-24 h-56 w-56 rounded-full bg-white/5" />
        </div>
    );
}