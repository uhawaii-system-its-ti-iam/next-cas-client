import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUser } from 'next-cas-client';

export default async function Home() {
    const currentUser = await getCurrentUser();

    return (
        <div className="container mx-auto flex justify-center">
            {currentUser ? (
                <Table>
                    <TableCaption>CAS attributes for {currentUser.user}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Attribute</TableHead>
                            <TableHead>Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(currentUser.attributes).map(([attribute, value]) => (
                            <TableRow key={attribute}>
                                <TableCell>{attribute}</TableCell>
                                <TableCell>{value.toString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>No user is logged in.</p>
            )}
        </div>
    );
}
