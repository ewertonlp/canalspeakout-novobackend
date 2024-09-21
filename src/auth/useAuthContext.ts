import { useContext } from 'react';
import { Context } from './JwtContext';

// ----------------------------------------------------------------------

export const useAuthContext = () => {
    const context = useContext(Context);

    if (!context) throw new Error('O contexto useAuthContext deve ser usado dentro do AuthProvider');

    return context;
}
