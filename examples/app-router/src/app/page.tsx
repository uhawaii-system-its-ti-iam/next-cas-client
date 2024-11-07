import CasAttributesTable from '@/components/cas-attributes-table';
import { getCurrentUser } from 'next-cas-client/app';

export default async function Home() {
    const currentUser = await getCurrentUser();

    return (
        <div className="container mx-auto flex justify-center">
            <CasAttributesTable currentUser={currentUser} />
        </div>
    );
}
