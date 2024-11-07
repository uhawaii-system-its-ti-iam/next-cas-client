import CasAttributesTable from '@/components/cas-attributes-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCurrentUser, isLoggedIn } from 'next-cas-client/pages';
import { CasUser } from 'next-cas-client';

export const getServerSideProps = (async (context) => {
    return { props: { isLoggedIn: await isLoggedIn(context), currentUser: await getCurrentUser(context) } };
}) satisfies GetServerSideProps<{ isLoggedIn: boolean; currentUser: CasUser | null }>;

export default function Home({ currentUser }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="container mx-auto flex justify-center">
            <CasAttributesTable currentUser={currentUser} />
        </div>
    );
}
