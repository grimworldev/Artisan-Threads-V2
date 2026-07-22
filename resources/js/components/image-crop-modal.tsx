import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

type Props = {
    open: boolean;
    imageSrc: string;
    aspect: number;
    cropShape?: 'round' | 'rect';
    onCancel: () => void;
    onConfirm: (croppedAreaPixels: Area) => void;
};

export function ImageCropModal({ open, imageSrc, aspect, cropShape = 'rect', onCancel, onConfirm }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg bg-background p-4">
                <div className="relative min-h-96 w-full overflow-hidden rounded-md bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="rounded-md border px-4 py-2 text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
                        className="rounded-md bg-olive-500 px-4 py-2 text-sm text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}