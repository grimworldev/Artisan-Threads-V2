import { useForm } from '@inertiajs/react';
import { Mail, MapPin, Phone, VenusAndMars, Cake, Pencil, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type UserInformation = {
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

type PersonalInformationProps = {
    id: number;
    username: string;
    email: string;
    information: UserInformation;
};

function formatBirthdate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

type Row = {
    icon: LucideIcon;
    label: string;
    value: string;
};

export function PersonalInformation({
    id,
    username,
    email,
    information,
}: PersonalInformationProps) {
    const {
        data,
        setData,
        patch,
        processing,
        errors,
        isDirty,
        reset,
    } = useForm({
        first_name: information.first_name ?? '',
        last_name: information.last_name ?? '',
        middle_name: information.middle_name ?? '',
        email: email ?? '',
        gender: information.gender ?? '',
        birthdate: information.birthdate ?? '',
        contact_no: information.contact_no ?? '',
        address: information.address ?? '',
        barangay: information.barangay ?? '',
        city: information.city ?? '',
        region: information.region ?? '',
    });
    const [isEditing, setIsEditing] = useState(false);

    function startEditing() {
        setIsEditing(true);
    }

    function cancelEditing() {
        reset();
        setIsEditing(false);
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // TODO: once you generate the Wayfinder route for this endpoint,
        // replace the string below with e.g.
        //   import { update } from '@/routes/profile';
        //   post(update(id).url, { ... })
        patch(`/profiles/${id}`, {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const fullName = [data.first_name, data.last_name]
        .filter(Boolean)
        .join(' ') || username;

    const address = [
        information.address,
        information.barangay,
        information.city,
        information.region,
    ]
        .filter(Boolean)
        .join(', ');

    const rows: Row[] = [
        { icon: Mail, label: 'Email', value: email || '—' },
        { icon: MapPin, label: 'Address', value: address || '—' },
        {
            icon: Phone,
            label: 'Contact Number',
            value: information.contact_no || '—',
        },
        {
            icon: VenusAndMars,
            label: 'Gender',
            value: information.gender || '—',
        },
        {
            icon: Cake,
            label: 'Birthdate',
            value: formatBirthdate(information.birthdate),
        },
    ];

    if (!isEditing) {
        return (
            <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-base font-semibold">{fullName}</h1>
                    <button
                        type="button"
                        onClick={startEditing}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </button>
                </div>

                <dl className="mt-3 divide-y">
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            className="flex items-center gap-3 py-2 text-sm first:pt-0 last:pb-0"
                        >
                            <dt title={row.label}>
                                <row.icon
                                    className="h-4 w-4 shrink-0 text-muted-foreground"
                                    aria-label={row.label}
                                />
                                <span className="sr-only">{row.label}</span>
                            </dt>
                            <dd>{row.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold">
                    Edit personal information
                </h1>
                <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                    label="First name"
                    value={data.first_name}
                    onChange={(v) => setData('first_name', v)}
                    error={errors.first_name}
                />
                <Field
                    label="Last name"
                    value={data.last_name}
                    onChange={(v) => setData('last_name', v)}
                    error={errors.last_name}
                />
                <Field
                    label="Middle name"
                    value={data.middle_name}
                    onChange={(v) => setData('middle_name', v)}
                    error={errors.middle_name}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(v) => setData('email', v)}
                    error={errors.email}
                />
                <Field
                    label="Contact number"
                    type="tel"
                    value={data.contact_no}
                    onChange={(v) => setData('contact_no', v)}
                    error={errors.contact_no}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-xs text-muted-foreground">
                        Gender
                    </label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">—</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Other</option>
                        <option value="Prefer not to say">
                            Prefer not to say
                        </option>
                    </select>
                    {errors.gender && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.gender}
                        </p>
                    )}
                </div>
                <Field
                    label="Birthdate"
                    type="date"
                    value={data.birthdate}
                    onChange={(v) => setData('birthdate', v)}
                    error={errors.birthdate}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
                <Field
                    label="Address"
                    value={data.address}
                    onChange={(v) => setData('address', v)}
                    error={errors.address}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                    label="Barangay"
                    value={data.barangay}
                    onChange={(v) => setData('barangay', v)}
                    error={errors.barangay}
                />
                <Field
                    label="City"
                    value={data.city}
                    onChange={(v) => setData('city', v)}
                    error={errors.city}
                />
                <Field
                    label="Region"
                    value={data.region}
                    onChange={(v) => setData('region', v)}
                    error={errors.region}
                />
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing || !isDirty}
                    className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Save changes
                </button>
            </div>
        </form>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
};

function Field({ label, value, onChange, error, type = 'text' }: FieldProps) {
    return (
        <div>
            <label className="text-xs text-muted-foreground">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}