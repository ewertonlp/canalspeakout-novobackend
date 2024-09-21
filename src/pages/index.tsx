import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

Index.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function Index() {
    const { push } = useRouter();

    const { usuario } = useAuthContext();

    useEffect(() => {
        if (usuario?.Master) push('/home');
        else push('/relatos')
    }, [])

    return <></>
}
