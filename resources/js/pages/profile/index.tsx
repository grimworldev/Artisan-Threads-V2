import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Business } from './components/business';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Documents, type Verification } from './components/documents';
import { ProfileHeader } from './partials/profile-header';
import { PersonalInformation } from './partials/profile-information';
import { Products } from './components/products';

type UserInformation = {
    id: number;
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

type ProductImage = {
    id: number;
    image_url: string;
    is_primary: boolean;
};

type Product = {
    uuid: string;
    product_name: string;
    price: string;
    quantity: number;
    status: number;
    primary_image: ProductImage | null;
};

type User = {
    id: number;
    username: string;
    email: string;
    information: UserInformation | null;
    avatar_path?: string | null;
    cover_path: string | null;
    avatar_url?: string | null;
    cover_url?: string | null;

    // 1 = verified. Drives the verified badge next to the full name.
    status?: number;

    shop?: {
        id: number;
        uuid: string;
        business_name: string;
        business_description: string | null;
        logo_path: string | null;
        logo_url?: string | null;
        region: string | null;
        city: string | null;
        barangay: string | null;
        address: string | null;
        contact_no: string | null;
        status: number;
        products?: Product[];
    } | null;

    documents?: Verification[];
};

type Props = {
    user: User;
};

function getInitials(user: User) {
    if (user.information) {
        const { first_name, last_name } = user.information;
        return `${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() ?? '?';
}

export default function Index({ user }: Props) {
    const fullName = user.information
        ? [user.information.first_name, user.information.last_name]
            .filter(Boolean)
            .join(' ')
        : user.username;

    return (
        <>
            <Head title="Profile" />
            <div className="my-6 flex flex-col gap-4">
                <ProfileHeader
                    user={user}
                    fullName={fullName}
                    initials={getInitials(user)}
                    isVerified={user.status === 1}
                />

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger className="cursor-pointer" value="overview">Overview</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="documents">Documents</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="business">Business</TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="overview"
                        className="flex flex-col gap-4"
                    >
                        {user.information && (
                            <PersonalInformation
                            id={user.id}
                                username={user.username}
                                email={user.email}
                                information={user.information}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="documents">
                        <Documents documents={user.documents ?? []} username={user.username} isOwner={true} />
                    </TabsContent>

                    <TabsContent value="business" className="flex flex-col gap-6">
                        <Business shop={user.shop ?? null} username={user.username} isOwner={true} />

                        {user.shop && (
                            <div>
                                <h2 className="mb-3 text-sm font-medium">Products</h2>
                                <Products products={user.shop.products ?? []} isOwner={true} />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Profile',
            href: dashboard(),
        },
    ],
};