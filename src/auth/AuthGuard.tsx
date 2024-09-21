import { UsuarioController } from 'controllers/UsuarioController';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import { Usuario } from 'types/Usuario';

// ----------------------------------------------------------------------

type AuthGuardProps = {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { pathname, push } = useRouter()

    const [user, setUser] = useState<Usuario>()

    useEffect(() => {
        const user = new UsuarioController().InformacaoUsuarioLogado();
        setUser(user)
    }, [pathname, push])

    if (!user) {
        return <LoadingScreen />
    }

    return <>{children}</>
}
