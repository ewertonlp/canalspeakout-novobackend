import { TreinamentoEmpresa } from 'types/TreinamentoEmpresa';
import api from './api';

export class TreinamentoEmpresaService {

    constructor() {
    }

    async BuscarPorId(id: number): Promise<TreinamentoEmpresa> {
        return api.get(`/TreinamentoEmpresa/${id}`);
    }

    async BuscarPorStatus(status: number): Promise<TreinamentoEmpresa> {
        return api.get(`/TreinamentoEmpresa?status=${status}`);
    }

    async Listar(): Promise<TreinamentoEmpresa[]> {
        return api.get(`/TreinamentoEmpresa/listar`);
    }    
}
