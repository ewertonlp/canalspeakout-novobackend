import { Usuario } from 'types/Usuario';
import api from './api';

class UsuarioService {

    constructor() {
    }

    async Logar(u: Usuario): Promise<Usuario> {
        return await api.post(`/Usuario/Logar`,u);
    }

    async Listar(u: Usuario): Promise<Usuario[]> {
        return await api.post(`/Usuario/Listar`,u);
    }

    async BuscarPorId(id: number): Promise<Usuario> {
        return await api.get(`/Usuario/BuscarPorId/${id}`);
    }
    
    async Salvar(usuario: Usuario): Promise<Usuario> {
        return await api.post('/Usuario/Salvar', usuario);
    }

    async Inativar(id: number): Promise<Usuario> {
        return await api.put(`/Usuario/Inativar/${id}`);
    }

    async AlteraSenha(u: Usuario): Promise<Usuario> {
        return await api.post('/Usuario/AlteraSenha', u);
    }

    async RecuperaSenhaPorEmail(u: Usuario) {
        return await api.post('/Usuario/RecuperaSenhaPorEmail', u);
    }
}

export default UsuarioService
