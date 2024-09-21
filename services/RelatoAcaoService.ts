import { RelatoAcao } from 'types/RelatoAcao';
import api from './api';

export class RelatoAcaoService {

    constructor() {
    }

    async ListarPorRelato(idRelato: number): Promise<RelatoAcao[]> {
        return await api.get(`/RelatoAcao/ListarPorRelato/${idRelato}`);
    }

    async BuscarPorId(id: number): Promise<RelatoAcao> {
        return await api.get(`/RelatoAcao/BuscarPorId/${id}`);
    }

    async Salvar(data: RelatoAcao): Promise<RelatoAcao> {
        return (await api.post(`/RelatoAcao/Salvar`, data)).data;
    }

    async Excluir(id: number): Promise<RelatoAcao> {
        return (await api.delete(`/RelatoAcao/Excluir/${id}`)).data;
    }
}