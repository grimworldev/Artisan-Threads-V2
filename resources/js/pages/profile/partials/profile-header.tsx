import { Camera, MoreHorizontal, Upload, Trash2, BadgeCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { ImageCropModal } from '@/components/image-crop-modal';
import { getCroppedImageBlob, type PixelCrop } from '@/lib/cropImage';
import type { Area } from 'react-easy-crop';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];

type ProfileHeaderUser = {
    username: string;
    avatar_path?: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;
};

type ProfileHeaderProps = {
    user: ProfileHeaderUser;
    fullName: string;
    initials: string;
    isVerified?: boolean;
};

export function ProfileHeader({
    user,
    fullName,
    initials,
    isVerified = false,
}: ProfileHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const coverMenuRef = useRef<HTMLDivElement>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverError, setCoverError] = useState<string | null>(null);
    const [coverMenuOpen, setCoverMenuOpen] = useState(false);

    const [rawAvatarSrc, setRawAvatarSrc] = useState<string | null>(null);
    const [rawCoverSrc, setRawCoverSrc] = useState<string | null>(null);

    const activeCover = coverPreview ?? user.cover_url ?? null;
    const avatarSrc = preview ?? (user.avatar_path ? user.avatar_url ?? null : null);

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
        e.target.value = '';
    }

    async function confirmAvatarCrop(pixels: Area) {
        if (!rawAvatarSrc) return;

        const blob = await getCroppedImageBlob(
            rawAvatarSrc,
            pixels as PixelCrop,
        );
        setPreview(URL.createObjectURL(blob));
        setRawAvatarSrc(null);

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
        router.delete('/profiles/cover', { preserveScroll: true });
    }

    return (
        <>
            <div className="overflow-hidden rounded-lg border">
                {/* Banner */}
                <div className="group relative aspect-[3/1] w-full bg-olive-500">
                    {activeCover && (
                        <img
                            src={activeCover}
                            alt="Cover photo"
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div ref={coverMenuRef} className="absolute top-2 right-2">
                        <button
                            type="button"
                            onClick={() => setCoverMenuOpen((open) => !open)}
                            aria-label="Cover photo options"
                            aria-expanded={coverMenuOpen}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60 focus-visible:opacity-100 sm:opacity-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {coverMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border bg-background shadow-lg">
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    Upload cover photo
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveCover}
                                    disabled={!activeCover}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-500 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
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
                    <p className="px-4 pt-2 text-xs text-red-500">{coverError}</p>
                )}

                <div className="px-4 py-4">
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative -mt-10 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-slate-200 text-xl font-semibold shadow-md sm:-mt-16 sm:h-32 sm:w-32 dark:bg-slate-700"
                        >
                            {avatarSrc ? (
                                <img
                                    src={avatarSrc}
                                    alt={fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-slate-600 dark:text-slate-200">
                                    {initials}
                                </span>
                            )}

                            <div className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/0 text-transparent transition-colors group-hover:bg-black/50 group-hover:text-white group-focus-visible:bg-black/50 group-focus-visible:text-white">
                                <Camera className="h-5 w-5" />
                                <span className="text-xs font-medium">
                                    Upload
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
                        {/* FULL NAME */}
                        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                            <div className="flex items-center gap-1">
                                <h1 className="text-lg font-semibold sm:text-xl">
                                    {fullName}
                                </h1>
                                {isVerified && (
                                    <BadgeCheck
                                        className="h-5 w-5 shrink-0 fill-blue-500 text-background"
                                        aria-label="Verified"
                                    />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                @{user.username}
                            </p>
                            {error && (
                                <p className="mt-1 text-xs text-red-500">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
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