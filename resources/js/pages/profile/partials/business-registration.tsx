import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler, useCallback, useState, ReactNode } from 'react';
import { AlertCircle, Crop as CropIcon, RotateCw, FileText } from 'lucide-react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { store } from '@/routes/shops';
import { cn } from '@/lib/utils';
import { BusinessBanner } from '../banners/business-banner';

// Logo is always square, unlike ID cards which have a fixed card ratio.
const LOGO_ASPECT = 1;

type BusinessForm = {
    business_name: string;
    business_description: string;
    logo: File | null;
    region: string;
    city: string;
    barangay: string;
    address: string;
    contact_no: string;
};

function FieldLabel({
    htmlFor,
    children,
    error,
}: {
    htmlFor: string;
    children: ReactNode;
    error?: string;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Label
                htmlFor={htmlFor}
                className={cn(error && 'text-destructive')}
            >
                {children}
            </Label>
            {error && (
                <span className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {error}
                </span>
            )}
        </div>
    );
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
}

async function getCroppedImage(
    imageSrc: string,
    cropPixels: Area,
    rotation: number,
    fileName: string,
): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Draw the rotated source onto an offscreen canvas first so the crop
    // box maps to the rotated image correctly.
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const rotatedWidth = image.width * cos + image.height * sin;
    const rotatedHeight = image.width * sin + image.height * cos;

    const rotatedCanvas = document.createElement('canvas');
    rotatedCanvas.width = rotatedWidth;
    rotatedCanvas.height = rotatedHeight;
    const rotatedCtx = rotatedCanvas.getContext('2d');
    if (!rotatedCtx) throw new Error('Could not get canvas context');

    // Fill white first so transparent PNG areas don't default to black
    // once flattened into JPEG.
    rotatedCtx.fillStyle = '#ffffff';
    rotatedCtx.fillRect(0, 0, rotatedWidth, rotatedHeight);

    rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    rotatedCtx.rotate(rad);
    rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    // Same here — fill white before compositing the cropped region.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropPixels.width, cropPixels.height);

    ctx.drawImage(
        rotatedCanvas,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(new File([blob], fileName, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.92,
        );
    });
}

export default function Business() {
    const form = useForm<BusinessForm>({
        business_name: '',
        business_description: '',
        logo: null,
        region: '',
        city: '',
        barangay: '',
        address: '',
        contact_no: '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);

    // Cropper dialog state
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const openFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCropDialogOpen(true);
        };
        reader.readAsDataURL(file);

        // reset the input so choosing the same file again still fires onChange
        e.target.value = '';
    };

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const applyCrop = async () => {
        if (!rawImageSrc || !croppedAreaPixels) return;

        const croppedFile = await getCroppedImage(
            rawImageSrc,
            croppedAreaPixels,
            rotation,
            'logo.jpg',
        );
        const previewUrl = URL.createObjectURL(croppedFile);

        setLogoPreview(previewUrl);
        form.setData('logo', croppedFile);

        setCropDialogOpen(false);
        setRawImageSrc(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(store.url(), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Register your business" />
            <BusinessBanner />
            <form onSubmit={submit} className="flex flex-col gap-6 border-rounded rounded-lg border p-4">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FieldLabel
                            htmlFor="business_name"
                            error={form.errors.business_name}
                        >
                            Business name
                        </FieldLabel>
                        <Input
                            className='capitalize'
                            id="business_name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            value={form.data.business_name}
                            onChange={(e) =>
                                form.setData('business_name', e.target.value)
                            }
                            placeholder="Business name"
                            aria-invalid={!!form.errors.business_name}
                        />
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel
                            htmlFor="business_description"
                            error={form.errors.business_description}
                        >
                            Description{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Textarea
                            className='capitalize'
                            id="business_description"
                            tabIndex={5}
                            value={form.data.business_description}
                            onChange={(e) =>
                                form.setData(
                                    'business_description',
                                    e.target.value,
                                )
                            }
                            placeholder="Tell customers what your business is about"
                            aria-invalid={!!form.errors.business_description}
                        />
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel htmlFor="logo" error={form.errors.logo}>
                            Logo{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Input
                            id="logo"
                            type="file"
                            accept="image/png,image/jpeg"
                            tabIndex={3}
                            onChange={openFilePicker}
                            aria-invalid={!!form.errors.logo}
                        />
                        {form.data.logo && (
                            <div className="mt-1 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLogoPreviewOpen(true)}
                                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="max-w-48 truncate">
                                        {form.data.logo.name}
                                    </span>
                                </button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        document.getElementById('logo')?.click()
                                    }
                                >
                                    <CropIcon className="h-4 w-4" />
                                    Re-crop / replace
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="region" error={form.errors.region}>
                                Region{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </FieldLabel>
                            <Input
                                className='capitalize'
                                id="region"
                                tabIndex={4}
                                value={form.data.region}
                                onChange={(e) =>
                                    form.setData('region', e.target.value)
                                }
                                placeholder="Region"
                                aria-invalid={!!form.errors.region}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="city" error={form.errors.city}>
                                City{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </FieldLabel>
                            <Input
                                className='capitalize'
                                id="city"
                                tabIndex={5}
                                value={form.data.city}
                                onChange={(e) =>
                                    form.setData('city', e.target.value)
                                }
                                placeholder="City"
                                aria-invalid={!!form.errors.city}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel htmlFor="barangay" error={form.errors.barangay}>
                            Barangay{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Input
                            className='capitalize'
                            id="barangay"
                            tabIndex={6}
                            value={form.data.barangay}
                            onChange={(e) =>
                                form.setData('barangay', e.target.value)
                            }
                            placeholder="Barangay"
                            aria-invalid={!!form.errors.barangay}
                        />
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel htmlFor="address" error={form.errors.address}>
                            Street address{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Input
                            className='capitalize'
                            id="address"
                            tabIndex={7}
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData('address', e.target.value)
                            }
                            placeholder="Unit no., street, subdivision"
                            aria-invalid={!!form.errors.address}
                        />
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel
                            htmlFor="contact_no"
                            error={form.errors.contact_no}
                        >
                            Contact number{' '}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Input
                            id="contact_no"
                            type="tel"
                            tabIndex={8}
                            value={form.data.contact_no}
                            onChange={(e) =>
                                form.setData('contact_no', e.target.value)
                            }
                            placeholder="09XX XXX XXXX"
                            aria-invalid={!!form.errors.contact_no}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    variant="olive"
                    disabled={form.processing}
                >
                    {form.processing && <Spinner />}
                    Register business
                </Button>
            </form>

            <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Crop your logo</DialogTitle>
                    </DialogHeader>

                    <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
                        {rawImageSrc && (
                            <Cropper
                                image={rawImageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={LOGO_ASPECT}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>

                    <div className="grid gap-3 pt-2">
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-xs text-muted-foreground">
                                Zoom
                            </span>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-xs text-muted-foreground">
                                Rotate
                            </span>
                            <input
                                type="range"
                                min={0}
                                max={360}
                                step={1}
                                value={rotation}
                                onChange={(e) => setRotation(Number(e.target.value))}
                                className="w-full"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setRotation((r) => (r + 90) % 360)}
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCropDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="button" variant="olive" onClick={applyCrop}>
                            Apply crop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={logoPreviewOpen} onOpenChange={setLogoPreviewOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="truncate">
                            {form.data.logo?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {logoPreview && (
                        <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full rounded-md border object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

Business.layout = {
    title: 'Register your business',
    description: 'Tell us about your business to get started',
};