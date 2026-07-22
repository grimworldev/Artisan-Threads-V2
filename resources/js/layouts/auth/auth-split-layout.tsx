import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center lg:grid-cols-2">
            <div className="hidden h-full flex-col p-10 text-white lg:flex dark:border-r bg-olive-500">
            </div>
            {/* RIGHT SIDE DETAILS */}
            <div className="w-full">
                <div className="mx-auto flex w-full max-w-sm flex-col justify-center px-6 sm:max-w-md sm:px-8 lg:max-w-lg lg:px-10">
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}