import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler, useState, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/shops';
import { cn } from '@/lib/utils';
import { BusinessBanner } from '../banners/business-banner';
import { DocumentsBanner } from '../banners/documents-banner';

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

export default function Business() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        form.setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : null);
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
            <DocumentsBanner />
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
                            accept="image/png,image/jpeg,image/svg+xml"
                            tabIndex={3}
                            onChange={handleLogoChange}
                            aria-invalid={!!form.errors.logo}
                        />
                        {logoPreview && (
                            <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="mt-2 h-20 w-20 rounded-md object-cover"
                            />
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
        </>
    );
}

Business.layout = {
    title: 'Register your business',
    description: 'Tell us about your business to get started',
};