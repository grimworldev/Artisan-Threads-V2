export function BusinessBanner() {
    return (
        <div className="relative overflow-hidden rounded-xl border bg-linear-to-r from-olive-600 via-olive-500 to-stone-600 p-8 text-white my-6">
            <div className="max-w-2xl">
                <span className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
                    Business Registration
                </span>

                <h1 className="text-3xl font-bold md:text-4xl">
                    Start Selling With Your Own Business
                </h1>

                <p className="mt-3 max-w-xl text-sm text-blue-100 md:text-base">
                    Register your business to showcase your products, build
                    customer trust, and reach more buyers on our platform.
                </p>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-24 h-56 w-56 rounded-full bg-white/5" />
        </div>
    );
}