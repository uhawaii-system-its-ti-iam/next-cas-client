import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CasUser } from 'next-cas-client';

const CasAttributesTable = ({ currentUser }: { currentUser: CasUser | null }) => {
    return (
        <>
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
        </>
    );
};

export default CasAttributesTable;
