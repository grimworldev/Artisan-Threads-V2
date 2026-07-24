import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler, ReactNode, useCallback, useState } from 'react';
import { AlertCircle, Crop as CropIcon, RotateCw } from 'lucide-react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { store } from '@/routes/documents';
import { cn } from '@/lib/utils';
import { DocumentsBanner } from '../banners/documents-banner';

// Philippine government-issued ID types commonly accepted for KYC/verification.
// `sides: 2` means the ID has a front and back that both need to be captured;
// a passport only has a single bio-data page, so it stays at 1.
const ID_TYPES = [
    { value: 'philippine_passport', label: 'Philippine Passport', sides: 1 },
    { value: 'philsys_national_id', label: 'PhilSys National ID', sides: 2 },
    { value: 'drivers_license', label: "Driver's License (LTO)", sides: 2 },
    { value: 'umid', label: 'UMID', sides: 2 },
    { value: 'prc_id', label: 'PRC ID', sides: 2 },
    { value: 'postal_id', label: 'Postal ID (PHLPost)', sides: 2 },
    { value: 'voters_id', label: "Voter's Certification (COMELEC)", sides: 2 },
    { value: 'tin_id', label: 'TIN ID (BIR)', sides: 2 },
    { value: 'philhealth_id', label: 'PhilHealth ID', sides: 2 },
] as const;

type DocumentType = (typeof ID_TYPES)[number]['value'];
type Side = 'front' | 'back';

// Standard ID card ratio (CR80, 85.6mm x 53.98mm). Passport bio page is
// roughly landscape too but slightly less elongated.
const CARD_ASPECT = 85.6 / 53.98;
const PASSPORT_ASPECT = 125 / 88;

type VerificationForm = {
    document_type: DocumentType | '';
    file: File | null;
    file_2: File | null;
};

type SlotState = {
    file: File | null;
    preview: string | null;
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

    rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    rotatedCtx.rotate(rad);
    rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

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

export default function ProfileVerification() {
    const form = useForm<VerificationForm>({
        document_type: '',
        file: null,
        file_2: null,
    });

    const [slots, setSlots] = useState<Record<Side, SlotState>>({
        front: { file: null, preview: null },
        back: { file: null, preview: null },
    });

    // Cropper dialog state
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [activeSide, setActiveSide] = useState<Side | null>(null);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const selectedType = ID_TYPES.find((t) => t.value === form.data.document_type);
    const sides = selectedType?.sides ?? 2;
    const aspect =
        form.data.document_type === 'philippine_passport' ? PASSPORT_ASPECT : CARD_ASPECT;

    const handleDocumentTypeChange = (value: string) => {
        form.setData('document_type', value as DocumentType);

        const newType = ID_TYPES.find((t) => t.value === value);
        if (newType?.sides === 1 && slots.back.file) {
            // Passport only needs one page — clear anything staged for "back".
            setSlots((prev) => ({ ...prev, back: { file: null, preview: null } }));
            form.setData('file_2', null);
        }
    };

    const openFilePicker = (side: Side, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result as string);
            setActiveSide(side);
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
        if (!rawImageSrc || !croppedAreaPixels || !activeSide) return;

        const fileName = `${form.data.document_type || 'id'}-${activeSide}.jpg`;
        const croppedFile = await getCroppedImage(
            rawImageSrc,
            croppedAreaPixels,
            rotation,
            fileName,
        );
        const previewUrl = URL.createObjectURL(croppedFile);

        setSlots((prev) => ({
            ...prev,
            [activeSide]: { file: croppedFile, preview: previewUrl },
        }));
        form.setData(activeSide === 'front' ? 'file' : 'file_2', croppedFile);

        setCropDialogOpen(false);
        setRawImageSrc(null);
        setActiveSide(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(store.url(), {
            forceFormData: true,
        });
    };

    const renderUploadSlot = (side: Side, label: string) => {
        const errorKey = side === 'front' ? 'file' : 'file_2';
        const error = form.errors[errorKey as keyof typeof form.errors];
        const slot = slots[side];

        return (
            <div className="grid gap-2">
                <FieldLabel htmlFor={`upload-${side}`} error={error}>
                    {label}
                </FieldLabel>
                <Input
                    id={`upload-${side}`}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => openFilePicker(side, e)}
                    aria-invalid={!!error}
                />
                {slot.preview && (
                    <div className="mt-1 flex items-center gap-3">
                        <img
                            src={slot.preview}
                            alt={`${label} preview`}
                            className="h-24 w-38 rounded-md border object-cover"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const input = document.getElementById(
                                    `upload-${side}`,
                                ) as HTMLInputElement | null;
                                input?.click();
                            }}
                        >
                            <CropIcon className="h-4 w-4" />
                            Re-crop / replace
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Verify your profile" />
            <DocumentsBanner />
            <form
                onSubmit={submit}
                className="flex flex-col gap-6 border-rounded rounded-lg border p-4"
            >
                <div className="grid gap-1">
                    <h2 className="text-lg font-semibold">Profile verification</h2>
                    <p className="text-sm text-muted-foreground">
                        Submit a valid government-issued ID. If your submission is
                        declined, you can submit a new one for review.
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FieldLabel
                            htmlFor="document_type"
                            error={form.errors.document_type}
                        >
                            ID type
                        </FieldLabel>
                        <Select
                            value={form.data.document_type}
                            onValueChange={handleDocumentTypeChange}
                        >
                            <SelectTrigger
                                id="document_type"
                                aria-invalid={!!form.errors.document_type}
                            >
                                <SelectValue placeholder="Select an ID type" />
                            </SelectTrigger>
                            <SelectContent>
                                {ID_TYPES.map((idType) => (
                                    <SelectItem key={idType.value} value={idType.value}>
                                        {idType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {renderUploadSlot(
                        'front',
                        sides === 1 ? 'Upload photo page' : 'Upload front of ID',
                    )}

                    {sides === 2 && renderUploadSlot('back', 'Upload back of ID')}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    variant="olive"
                    disabled={form.processing}
                >
                    {form.processing && <Spinner />}
                    Submit for verification
                </Button>
            </form>

            <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Crop your ID</DialogTitle>
                    </DialogHeader>

                    <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
                        {rawImageSrc && (
                            <Cropper
                                image={rawImageSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspect}
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
        </>
    );
}

ProfileVerification.layout = {
    title: 'Verify your profile',
    description: 'Submit your requirements to get verified',
};