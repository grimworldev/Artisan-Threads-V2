import { Head, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Camera, MoreHorizontal, Upload, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ImageCropModal } from '@/components/image-crop-modal';
import { getCroppedImageBlob, type PixelCrop } from '@/lib/cropImage';
import type { Area } from 'react-easy-crop';

type UserInformation = {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    gender: string | null;
    birthdate: string | null;
    region: string | null;
    city: string | null;
    barangay: string | null;
    address: string | null;
    contact_no: string | null;
};

type User = {
    id: number;
    username: string;
    email: string;
    information: UserInformation | null;
    avatar_path?: string | null;
    cover_path: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;
};

type Props = {
    user: User;
};

function getInitials(user: User) {
    if (user.information) {
        const { first_name, last_name } = user.information;
        return `${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() ?? '?';
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];

export default function Index({ user }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const coverMenuRef = useRef<HTMLDivElement>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverError, setCoverError] = useState<string | null>(null);
    const [coverMenuOpen, setCoverMenuOpen] = useState(false);

    // Raw (uncropped) image sources, staged for the crop modal
    const [rawAvatarSrc, setRawAvatarSrc] = useState<string | null>(null);
    const [rawCoverSrc, setRawCoverSrc] = useState<string | null>(null);

    const fullName = user.information
        ? [user.information.first_name, user.information.last_name]
              .filter(Boolean)
              .join(' ')
        : user.username;

    const activeCover = coverPreview ?? user.cover_url;

    // Close the cover dropdown when clicking anywhere outside it
    useEffect(() => {
        if (!coverMenuOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (
                coverMenuRef.current &&
                !coverMenuRef.current.contains(e.target as Node)
            ) {
                setCoverMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [coverMenuOpen]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Please upload a JPG, PNG, or SVG file.');
            return;
        }

        setError(null);
        setRawAvatarSrc(URL.createObjectURL(file));
        e.target.value = ''; // allow re-selecting the same file later
    }

    async function confirmAvatarCrop(pixels: Area) {
        if (!rawAvatarSrc) return;

        const blob = await getCroppedImageBlob(
            rawAvatarSrc,
            pixels as PixelCrop,
        );
        setPreview(URL.createObjectURL(blob));
        setRawAvatarSrc(null);

        // Wire this up to your actual upload route, e.g.:
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');
        router.post('/profiles/avatar', formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setCoverError('Please upload a JPG, PNG, or SVG file.');
            return;
        }

        setCoverError(null);
        setCoverMenuOpen(false);
        setRawCoverSrc(URL.createObjectURL(file));
        e.target.value = '';
    }

    async function confirmCoverCrop(pixels: Area) {
        if (!rawCoverSrc) return;

        const blob = await getCroppedImageBlob(
            rawCoverSrc,
            pixels as PixelCrop,
        );
        setCoverPreview(URL.createObjectURL(blob));
        setRawCoverSrc(null);

        // Wire this up to your actual upload route, e.g.:
        const formData = new FormData();
        formData.append('cover', blob, 'cover.jpg');
        router.post('/profiles/cover', formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function handleRemoveCover() {
        setCoverPreview(null);
        setCoverError(null);
        setCoverMenuOpen(false);

        // Wire this up to your actual remove route, e.g.:
        router.delete('/profiles/cover', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Profile" />
            <div className="my-10 flex flex-col gap-6">
                <div className="overflow-hidden rounded-lg border">
                    {/* Banner */}
                    <div className="group relative h-48 w-full bg-olive-500 sm:h-64">
                        {activeCover && (
                            <img
                                src={activeCover}
                                alt="Cover photo"
                                className="h-full w-full object-cover"
                            />
                        )}
                        {/* Three-dot menu trigger */}
                        <div
                            ref={coverMenuRef}
                            className="absolute top-3 right-3"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setCoverMenuOpen((open) => !open)
                                }
                                aria-label="Cover photo options"
                                aria-expanded={coverMenuOpen}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60 focus-visible:opacity-100 sm:opacity-0"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </button>

                            {coverMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border bg-background shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            coverInputRef.current?.click()
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Upload cover photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCover}
                                        disabled={!activeCover}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove cover photo
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/svg+xml"
                            onChange={handleCoverFileChange}
                            className="hidden"
                        />
                    </div>

                    {coverError && (
                        <p className="px-6 pt-2 text-sm text-red-500">
                            {coverError}
                        </p>
                    )}

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-slate-200 text-2xl font-semibold shadow-md sm:h-32 sm:w-32 dark:bg-slate-700"
                            >
                                {preview || user.avatar_path ? (
                                    <img
                                        src={preview ?? user.avatar_url ?? ''}
                                        alt={fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-slate-600 dark:text-slate-200">
                                        {getInitials(user)}
                                    </span>
                                )}

                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 text-transparent transition-colors group-hover:bg-black/50 group-hover:text-white group-focus-visible:bg-black/50 group-focus-visible:text-white">
                                    <Camera className="h-6 w-6" />
                                    <span className="text-xs font-medium">
                                        Upload photo
                                    </span>
                                </div>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/svg+xml"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center pb-1 text-center sm:items-start sm:text-left">
                                <h1 className="text-xl font-semibold">
                                    {fullName}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    @{user.username}
                                </p>
                                {error && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-lg border p-6">
                        <h2 className="mb-4 text-lg font-medium">Account</h2>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Username
                                </dt>
                                <dd>{user.username}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                        </dl>
                    </div>

                    {user.information && (
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-lg font-medium">
                                Personal Information
                            </h2>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">
                                        First name
                                    </dt>
                                    <dd>{user.information.first_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Last name
                                    </dt>
                                    <dd>{user.information.last_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Middle name
                                    </dt>
                                    <dd>
                                        {user.information.middle_name ?? '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Gender
                                    </dt>
                                    <dd>{user.information.gender ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Birthdate
                                    </dt>
                                    <dd>{user.information.birthdate ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Contact no.
                                    </dt>
                                    <dd>
                                        {user.information.contact_no ?? '—'}
                                    </dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-muted-foreground">
                                        Address
                                    </dt>
                                    <dd>
                                        {[
                                            user.information.address,
                                            user.information.barangay,
                                            user.information.city,
                                            user.information.region,
                                        ]
                                            .filter(Boolean)
                                            .join(', ') || '—'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {/* Once UserDocuments and Shops relations are ready, add similar
                        <div className="rounded-lg border p-6"> blocks for each here. */}
                </div>
            </div>

            <ImageCropModal
                open={!!rawAvatarSrc}
                imageSrc={rawAvatarSrc ?? ''}
                aspect={1}
                cropShape="round"
                onCancel={() => setRawAvatarSrc(null)}
                onConfirm={confirmAvatarCrop}
            />
            <ImageCropModal
                open={!!rawCoverSrc}
                imageSrc={rawCoverSrc ?? ''}
                aspect={3}
                cropShape="rect"
                onCancel={() => setRawCoverSrc(null)}
                onConfirm={confirmCoverCrop}
            />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Profile',
            href: dashboard(),
        },
    ],
};
