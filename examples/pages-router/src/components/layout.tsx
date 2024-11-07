import Navbar from './navbar';

const Layout = ({ isLoggedIn, children }: { isLoggedIn: boolean; children: React.ReactNode }) => {
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <main>{children}</main>
        </>
    );
};

export default Layout;
