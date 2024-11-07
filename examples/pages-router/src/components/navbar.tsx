import LoginButton from './login-button';

const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <nav className="mb-10 bg-white border-b-[1px] pointer-events-auto sticky top-0 z-50">
            <div className="flex container mx-auto py-2 items-center justify-between">
                <div className="flex items-center">
                    <h1 className="font-bold text-xl">Next CAS Client Example</h1>
                    <span className="text-neutral-500 ml-1">(Pages Router)</span>
                </div>

                <LoginButton isLoggedIn={isLoggedIn} />
            </div>
        </nav>
    );
};

export default Navbar;
