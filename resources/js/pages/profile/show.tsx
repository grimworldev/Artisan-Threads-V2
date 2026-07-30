import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Store } from 'lucide-react';
import { Business } from './components/business';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { ProfileHeader } from './components/profile';
import { Products } from './components/products';
import { PersonalInformation } from './components/information';

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
    avatar_url?: string | null;
    cover_url?: string | null;

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

export default function Show({ user }: Props) {
    const fullName = user.information
        ? [user.information.first_name, user.information.last_name]
            .filter(Boolean)
            .join(' ')
        : user.username;

    return (
        <>
            <Head title={fullName} />
            <div className="my-6 flex flex-col gap-4">
                <ProfileHeader
                    user={user}
                    fullName={fullName}
                    initials={getInitials(user)}
                />

                {/* Tabs - no Documents tab, this is a public/other-user view */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger className="cursor-pointer" value="overview">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="business">
                            Business
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="overview"
                        className="flex flex-col gap-4"
                    >
                        {user.information && (
                            <PersonalInformation
                                fullName={fullName}
                                email={user.email}
                                information={user.information}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="business" className="flex flex-col gap-6">
                        <Business
                            shop={user.shop ?? null}
                            username={user.username}
                            isOwner={false}
                        />

                        {user.shop && (
                            <div>
                                <h2 className="mb-3 text-sm font-medium">Products</h2>
                                <Products products={user.shop.products ?? []} />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Profile',
            href: dashboard(),
        },
    ],
};