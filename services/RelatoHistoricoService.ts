import { RelatoHistorico } from 'types/RelatoHistorico';
import api from './api';

export class RelatoHistoricoService {

    constructor() {
    }

    async ListarPorRelato(idRelato: number): Promise<RelatoHistorico[]> {
        return await api.get(`/RelatoHistorico/ListarPorRelato/${idRelato}`);
    }

    async ListarPorProtocolo(protocolo:string): Promise<RelatoHistorico[]> {
        return await api.get(`/RelatoHistorico/ListarPorProtocolo/${protocolo}`);
    }

    async Salvar(data: RelatoHistorico): Promise<RelatoHistorico> {
        return (await api.post(`/RelatoHistorico/Salvar`, data)).data;
    }

    async Excluir(id: number): Promise<RelatoHistorico> {
        return (await api.delete(`/RelatoHistorico/Excluir/${id}`)).data;
    }
}
