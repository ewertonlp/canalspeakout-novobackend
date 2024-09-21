import { UsuarioController } from 'controllers/UsuarioController';
import { createContext, useEffect, useState } from 'react';
import { Usuario } from 'types/Usuario';
import { ContextType } from './types';

// ----------------------------------------------------------------------

export const Context = createContext<ContextType | null>(null);

// ----------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
    
    const [usuario, setUsuario] = useState<Usuario>();

    const getUsuario = () => {

        const u = new UsuarioController().InformacaoUsuarioLogado();
        setUsuario(u);
    }

    useEffect(() => {
        getUsuario()
    }, [])

    return (
        <Context.Provider
            value={{
                // idEmpresa,
                // setIdEmpresa,
                usuario,
            }}
        >
            {children}
        </Context.Provider>
    )
}

