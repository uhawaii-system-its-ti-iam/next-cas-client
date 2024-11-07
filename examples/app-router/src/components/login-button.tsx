'use client';

import { login, logout } from 'next-cas-client';
import { Button } from './ui/button';

const LoginButton = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <>
            {isLoggedIn ? (
                <Button onClick={() => logout()}>Logout</Button>
            ) : (
                <Button onClick={() => login()}>Login</Button>
            )}
        </>
    );
};

export default LoginButton;
