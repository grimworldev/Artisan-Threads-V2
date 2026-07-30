import { Mail, MapPin, Phone, VenusAndMars, Cake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PersonalInformationUser = {
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
    fullName: string;
    email: string;
    information: PersonalInformationUser;
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
    fullName,
    email,
    information,
}: PersonalInformationProps) {
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

    return (
        <div className="rounded-lg border p-4">
            <h1 className="text-base font-semibold">{fullName}</h1>

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