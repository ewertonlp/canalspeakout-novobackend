import Head from 'next/head';
import GuestGuard from '../../auth/AuthGuard';
import Login from '../login';

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Head>
                <title> Login</title>
            </Head>

            <GuestGuard>{ <Login />}</GuestGuard>
        </>
    )
}
