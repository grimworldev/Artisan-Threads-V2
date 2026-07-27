// resources/js/Pages/products/partials/store-product.tsx
import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler, useCallback, useRef, useState, ReactNode } from 'react';
import { AlertCircle, Crop as CropIcon, RotateCw, FileText, X, ImagePlus } from 'lucide-react';
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
import { store } from '@/routes/products';
import { cn } from '@/lib/utils';
import { ProductBanner } from '../banners/product-banner';

// Product photos crop to a square, same as the business logo.
// Swap to 4 / 3 here if you'd rather have a landscape product shot.
const PRODUCT_IMAGE_ASPECT = 1;

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type ProductForm = {
    product_name: string;
    product_description: string;
    price: string;
    category: string
    quantity: string;
    images: File[];
};

type ImageItem = {
    id: string;
    file: File; // the cropped output sent to the server
    rawSrc: string; // original data URL, kept so "Re-crop" reopens the same source
    originalName: string;
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
            <Label htmlFor={htmlFor} className={cn(error && 'text-destructive')}>
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

    rotatedCtx.fillStyle = '#ffffff';
    rotatedCtx.fillRect(0, 0, rotatedWidth, rotatedHeight);
    rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    rotatedCtx.rotate(rad);
    rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

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

// Cropped output is always re-encoded as jpeg — keep the original base
// name but force a .jpg extension so the file/mime types stay consistent.
function toJpegFileName(originalName: string): string {
    const base = originalName.replace(/\.[^/.]+$/, '') || 'product-image';
    return `${base}.jpg`;
}

export default function StoreProduct() {

    const CATEGORIES: Record<string, string> = {
        food_beverage: 'Food & Beverage',
        fashion_apparel: 'Fashion & Apparel',
        home_living: 'Home & Living',
        health_beauty: 'Health & Beauty',
        electronics: 'Electronics',
        crafts_handmade: 'Crafts & Handmade',
        agriculture: 'Agriculture & Produce',
        services: 'Services',
        other: 'Other',
    };

    const form = useForm<ProductForm>({
        product_name: '',
        product_description: '',
        category: '',
        price: '',
        quantity: '',
        images: [],
    });

    const [images, setImages] = useState<ImageItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cropper dialog state
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [pendingName, setPendingName] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null); // null = adding a new image
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const syncFormImages = (next: ImageItem[]) => {
        setImages(next);
        form.setData('images', next.map((item) => item.file));
    };

    const openFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // allow re-selecting the same file later
        if (!file) return;

        setFileError(null);

        if (images.length >= MAX_IMAGES) {
            setFileError(`You can upload a maximum of ${MAX_IMAGES} images.`);
            return;
        }
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setFileError(`"${file.name}" is not a supported image type (jpeg, jpg, png, webp).`);
            return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setFileError(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result as string);
            setPendingName(file.name);
            setEditingId(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCropDialogOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const openRecrop = (item: ImageItem) => {
        setRawImageSrc(item.rawSrc);
        setPendingName(item.originalName);
        setEditingId(item.id);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCropDialogOpen(true);
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
            toJpegFileName(pendingName),
        );

        if (editingId) {
            // Re-cropping an existing item — replace it in place, keep its position.
            syncFormImages(
                images.map((item) =>
                    item.id === editingId
                        ? { ...item, file: croppedFile, rawSrc: rawImageSrc }
                        : item,
                ),
            );
        } else {
            const newItem: ImageItem = {
                id: crypto.randomUUID(),
                file: croppedFile,
                rawSrc: rawImageSrc,
                originalName: pendingName,
            };
            syncFormImages([...images, newItem]);
        }

        setCropDialogOpen(false);
        setRawImageSrc(null);
        setEditingId(null);
    };

    const removeImage = (id: string) => {
        syncFormImages(images.filter((item) => item.id !== id));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(store.url(), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Add Product" />
            <ProductBanner />
            <form onSubmit={submit} className="flex flex-col gap-6 border-rounded rounded-lg border p-4">
                <div className="">
                    <h1 className="text-xl font-semibold">Product Registration</h1>
                    <p className="text-sm text-muted-foreground">
                        Fill in your product details to list it on your shop.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FieldLabel htmlFor="product_name" error={form.errors.product_name}>
                            Name
                        </FieldLabel>
                        <Input
                            className="capitalize"
                            id="product_name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            value={form.data.product_name}
                            onChange={(e) => form.setData('product_name', e.target.value)}
                            placeholder="Product name"
                            aria-invalid={!!form.errors.product_name}
                        />
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel
                            htmlFor="product_description"
                            error={form.errors.product_description}
                        >
                            Details
                        </FieldLabel>
                        <Textarea
                            className="capitalize"
                            id="product_description"
                            tabIndex={2}
                            value={form.data.product_description}
                            onChange={(e) => form.setData('product_description', e.target.value)}
                            placeholder="Describe your product"
                            aria-invalid={!!form.errors.product_description}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="price" error={form.errors.price}>
                                Price
                            </FieldLabel>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                tabIndex={3}
                                value={form.data.price}
                                onChange={(e) => form.setData('price', e.target.value)}
                                placeholder="0.00"
                                aria-invalid={!!form.errors.price}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="quantity" error={form.errors.quantity}>
                                Quantity
                            </FieldLabel>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                step="1"
                                tabIndex={4}
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', e.target.value)}
                                placeholder="0"
                                aria-invalid={!!form.errors.quantity}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="category" error={form.errors.category}>
                                Category{' '}
                                <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <select
                                id="category"
                                tabIndex={3}
                                value={form.data.category}
                                onChange={(e) => form.setData('category', e.target.value)}
                                aria-invalid={!!form.errors.category}
                                className={cn(
                                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
                                    form.errors.category && 'border-destructive',
                                )}
                            >
                                <option value="">Select a category</option>
                                {Object.entries(CATEGORIES).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <FieldLabel htmlFor="images" error={form.errors.images}>
                            Images{' '}
                            <span className="text-muted-foreground">
                                (up to {MAX_IMAGES}, {MAX_FILE_SIZE_MB}MB each)
                            </span>
                        </FieldLabel>

                        <Input
                            ref={fileInputRef}
                            id="images"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            tabIndex={5}
                            className="hidden"
                            onChange={openFilePicker}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            disabled={images.length >= MAX_IMAGES}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-fit"
                        >
                            <ImagePlus className="h-4 w-4" />
                            Add image
                        </Button>

                        {fileError && (
                            <p className="text-sm text-destructive">{fileError}</p>
                        )}

                        {images.length > 0 && (
                            <ul className="mt-1 flex flex-col gap-2">
                                {images.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <span className="max-w-48 truncate text-sm">
                                                {item.originalName}
                                            </span>
                                            {index === 0 && (
                                                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openRecrop(item)}
                                            >
                                                <CropIcon className="h-4 w-4" />
                                                Re-crop
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeImage(item.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <Button type="submit" className="w-full" variant="olive" disabled={form.processing}>
                    {form.processing && <Spinner />}
                    Add product
                </Button>
            </form>

            <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? 'Re-crop image' : 'Crop image'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
                        {rawImageSrc && (
                            <Cropper
                                image={rawImageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={PRODUCT_IMAGE_ASPECT}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>

                    <div className="grid gap-3 pt-2">
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-xs text-muted-foreground">Zoom</span>
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
                            <span className="w-14 text-xs text-muted-foreground">Rotate</span>
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
                            onClick={() => {
                                setCropDialogOpen(false);
                                setEditingId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="button" variant="olive" onClick={applyCrop}>
                            Apply crop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

StoreProduct.layout = {
    title: 'Add a product',
    description: 'List a new product in your shop',
};