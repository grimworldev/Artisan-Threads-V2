import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler, useState, ReactNode } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {Popover,PopoverContent,PopoverTrigger,} from '@/components/ui/popover';
import { login } from '@/routes';
import { store } from '@/routes/users';
import { cn } from '@/lib/utils';

type Props = {
    passwordRules: string;
};

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: string;
    birthdate: string;
    contact_no: string;
    region: string;
    city: string;
    barangay: string;
    address: string;
};

const STEPS = [
    { label: 'Account Details', fields: ['username', 'email', 'password', 'password_confirmation'] as const, required: ['username', 'email', 'password', 'password_confirmation'] as const },
    { label: 'Personal Information', fields: ['first_name', 'middle_name', 'last_name', 'gender', 'birthdate', 'contact_no'] as const, required: ['first_name', 'last_name'] as const },
    { label: 'Personal Address', fields: ['region', 'city', 'barangay', 'address'] as const, required: [] as const },
];

// Reusable label that shows a small alert icon + popover with the error
// message when `error` is set, and turns the label text red too.
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

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState(0);

    const form = useForm<RegisterForm>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        birthdate: '',
        contact_no: '',
        region: '',
        city: '',
        barangay: '',
        address: '',
    });

    const isLastStep = step === STEPS.length - 1;

    const stepHasMissingField = (index: number) =>
        STEPS[index].required.some((field) => !form.data[field]?.trim());

    const goNext = () => {
        if (stepHasMissingField(step)) {
            form.setError(
                Object.fromEntries(
                    STEPS[step].required
                        .filter((field) => !form.data[field]?.trim())
                        .map((field) => [field, 'This field is required.']),
                ),
            );
            return;
        }
        form.clearErrors();
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => {
        form.clearErrors();
        setStep((s) => Math.max(s - 1, 0));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!isLastStep) {
            goNext();
            return;
        }

        form.post(store.url(), {
            onError: (errors) => {
                const erroredStep = STEPS.findIndex((s) =>
                    s.fields.some((field) => field in errors),
                );
                if (erroredStep !== -1) setStep(erroredStep);
            },
            onSuccess: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <form onSubmit={submit} className="flex flex-col gap-6" autoComplete='off'>
                {/* Stepper: each <li> owns its own label, circle, and two half-connector
                    lines. This scales to any number of steps automatically — nothing
                    here is hardcoded to "3 steps". */}
                <div className="flex w-ful">
                    {STEPS.map((s, i) => (
                        <div key={s.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                            <div className="flex h-8 w-full items-center justify-center px-1 sm:h-5">
                                <span
                                    className={cn(
                                        'line-clamp-2 text-center text-[10px] leading-tight font-medium transition-colors sm:line-clamp-1 sm:text-xs',
                                        i === step ? 'text-foreground' : 'text-muted-foreground',
                                    )}
                                >
                                    {s.label}
                                </span>
                            </div>

                            <div className="relative flex h-7 w-full items-center justify-center">
                                {i !== 0 && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2',
                                            i <= step ? 'bg-primary' : 'bg-muted-foreground/30',
                                        )}
                                    />
                                )}
                                {i !== STEPS.length - 1 && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2',
                                            i < step ? 'bg-primary' : 'bg-muted-foreground/30',
                                        )}
                                    />
                                )}
                                <span
                                    className={cn(
                                        'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium transition-colors',
                                        i < step && 'border-primary bg-primary text-primary-foreground',
                                        i === step && 'border-primary text-primary',
                                        i > step && 'border-muted-foreground/30 text-muted-foreground',
                                    )}
                                >
                                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {step === 0 && (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <FieldLabel htmlFor="username" error={form.errors.username}>
                                Username
                            </FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                value={form.data.username}
                                onChange={(e) => form.setData('username', e.target.value)}
                                placeholder="Username"
                                aria-invalid={!!form.errors.username}
                            />
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="email" error={form.errors.email}>
                                Email address
                            </FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                tabIndex={2}
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="email@example.com"
                                aria-invalid={!!form.errors.email}
                            />
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="password" error={form.errors.password}>
                                Password
                            </FieldLabel>
                            <PasswordInput
                                id="password"
                                tabIndex={3}
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder="Password"
                                passwordrules={passwordRules}
                                aria-invalid={!!form.errors.password}
                            />
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="password_confirmation" error={form.errors.password_confirmation}>
                                Confirm password
                            </FieldLabel>
                            <PasswordInput
                                id="password_confirmation"
                                tabIndex={4}
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                                passwordrules={passwordRules}
                                aria-invalid={!!form.errors.password_confirmation}
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="first_name" error={form.errors.first_name}>
                                    First name
                                </FieldLabel>
                                <Input
                                    id="first_name"
                                    autoFocus
                                    tabIndex={1}
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                    placeholder="First name"
                                    aria-invalid={!!form.errors.first_name}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="last_name" error={form.errors.last_name}>
                                    Last name
                                </FieldLabel>
                                <Input
                                    id="last_name"
                                    tabIndex={2}
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                    placeholder="Last name"
                                    aria-invalid={!!form.errors.last_name}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="middle_name" error={form.errors.middle_name}>
                                Middle name <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <Input
                                id="middle_name"
                                tabIndex={3}
                                value={form.data.middle_name}
                                onChange={(e) => form.setData('middle_name', e.target.value)}
                                placeholder="Middle name"
                                aria-invalid={!!form.errors.middle_name}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="gender" error={form.errors.gender}>
                                    Gender <span className="text-muted-foreground">(optional)</span>
                                </FieldLabel>
                                <Input
                                    id="gender"
                                    tabIndex={4}
                                    value={form.data.gender}
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                    placeholder="Gender"
                                    aria-invalid={!!form.errors.gender}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="birthdate" error={form.errors.birthdate}>
                                    Birthdate <span className="text-muted-foreground">(optional)</span>
                                </FieldLabel>
                                <Input
                                    id="birthdate"
                                    type="date"
                                    tabIndex={5}
                                    value={form.data.birthdate}
                                    onChange={(e) => form.setData('birthdate', e.target.value)}
                                    aria-invalid={!!form.errors.birthdate}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="contact_no" error={form.errors.contact_no}>
                                Contact number <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <Input
                                id="contact_no"
                                type="tel"
                                tabIndex={6}
                                value={form.data.contact_no}
                                onChange={(e) => form.setData('contact_no', e.target.value)}
                                placeholder="09XX XXX XXXX"
                                aria-invalid={!!form.errors.contact_no}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="region" error={form.errors.region}>
                                    Region <span className="text-muted-foreground">(optional)</span>
                                </FieldLabel>
                                <Input
                                    id="region"
                                    autoFocus
                                    tabIndex={1}
                                    value={form.data.region}
                                    onChange={(e) => form.setData('region', e.target.value)}
                                    placeholder="Region"
                                    aria-invalid={!!form.errors.region}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="city" error={form.errors.city}>
                                    City <span className="text-muted-foreground">(optional)</span>
                                </FieldLabel>
                                <Input
                                    id="city"
                                    tabIndex={2}
                                    value={form.data.city}
                                    onChange={(e) => form.setData('city', e.target.value)}
                                    placeholder="City"
                                    aria-invalid={!!form.errors.city}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="barangay" error={form.errors.barangay}>
                                Barangay <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <Input
                                id="barangay"
                                tabIndex={3}
                                value={form.data.barangay}
                                onChange={(e) => form.setData('barangay', e.target.value)}
                                placeholder="Barangay"
                                aria-invalid={!!form.errors.barangay}
                            />
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="address" error={form.errors.address}>
                                Street address <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <Input
                                id="address"
                                tabIndex={4}
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="House no., street, subdivision"
                                aria-invalid={!!form.errors.address}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    {step > 0 && (
                        <Button type="button" variant="outline" className="w-full" onClick={goBack}>
                            Back
                        </Button>
                    )}
                    <Button type="submit" className="w-full" variant="outline" disabled={form.processing}>
                        {form.processing && <Spinner />}
                        {isLastStep ? 'Create account' : 'Next'}
                    </Button>
                </div>

                {step === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={login()} tabIndex={5}>
                            Log in
                        </TextLink>
                    </div>
                )}
            </form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};