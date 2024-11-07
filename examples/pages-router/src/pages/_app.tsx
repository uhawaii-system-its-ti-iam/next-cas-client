import Layout from '@/components/layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Layout className={`${geistSans.variable} ${geistMono.variable}`} {...pageProps}>
            <Component {...pageProps} />;
        </Layout>
    );
}
