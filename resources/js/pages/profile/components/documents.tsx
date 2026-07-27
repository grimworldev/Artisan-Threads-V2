import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FileCheck2, Clock, XCircle, FileStack, FileText } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ID_TYPES } from '../partials/profile-verification';

export type Verification = {
    id: number;
    user_id: number;
    document_type: string;
    file_url: string | null;
    file_2_url: string | null;
    original_filename: string | null;
    original_filename_2: string | null;
    status: number; // 0 = pending, 1 = approved, 2 = declined
    rejection_reason: string | null;
    created_at: string;
};

type Props = {
    documents: Verification[];
    username: string;
    isOwner: boolean;
};

type PreviewState = {
    url: string;
    filename: string;
} | null;

export function Documents({ documents, username, isOwner }: Props) {
    const [preview, setPreview] = useState<PreviewState>(null);

    const document = documents.length
        ? [...documents].sort(
              (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
          )[0]
        : null;

    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <FileStack className="h-8 w-8 text-muted-foreground" />
                <div>
                    <p className="text-sm font-medium">
                        No documents submitted yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isOwner
                            ? 'Submit a government-issued ID to get your profile verified.'
                            : "This user hasn't submitted verification documents yet."}
                    </p>
                </div>
                {isOwner && (
                    <Link
                        href={`/profiles/${username}/account/verification`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Submit a document
                    </Link>
                )}
            </div>
        );
    }

    const isVerified = document.status === 1;
    const label =
        ID_TYPES.find((t: any) => t.value === document.document_type)?.label ??
        document.document_type;

    const fileButton = (url: string | null, filename: string | null, fallback: string) => {
        if (!url) return null;
        const name = filename ?? fallback;
        return (
            <button
                type="button"
                onClick={() => setPreview({ url, filename: name })}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer"
            >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="max-w-48 truncate">{name}</span>
            </button>
        );
    };

    return (
        <div className="rounded-lg border p-4">
            {isOwner && !isVerified && (
                <Link
                    href={`/profiles/${username}/account/verification`}
                    className="bg-olive-500 px-1 py-1.5 text-sm rounded-md text-white font-bold cursor-pointer"
                >
                    {document.status === 2 ? 'Resubmit document' : 'Submit another'}
                </Link>
            )}
            <div className="flex items-center justify-between gap-2 my-2">
                <div>
                    <h3 className="text-sm font-semibold">{label}</h3>
                    <p className="text-xs text-muted-foreground">
                        Submitted{' '}
                        {new Date(document.created_at).toLocaleDateString()}
                    </p>
                </div>
                {isVerified ? (
                    <span className="flex items-center gap-1 rounded-full bg-blue-400 px-2 py-1 text-xs font-medium text-white">
                        <FileCheck2 className="h-3.5 w-3.5" />
                        Verified
                    </span>
                ) : document.status === 2 ? (
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                        <XCircle className="h-3.5 w-3.5" />
                        Declined
                    </span>
                ) : (
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Pending review
                    </span>
                )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {fileButton(document.file_url, document.original_filename, 'Front of ID')}
                {fileButton(document.file_2_url, document.original_filename_2, 'Back of ID')}
            </div>

            {document.status === 2 && (
                <div className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {document.rejection_reason ?? 'Your submission was declined.'}
                </div>
            )}

            <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="truncate">
                            {preview?.filename}
                        </DialogTitle>
                    </DialogHeader>
                    {preview && (
                        <img
                            src={preview.url}
                            alt={preview.filename}
                            className="w-full rounded-md border object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}