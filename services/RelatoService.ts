import { Relato } from 'types/Relato';
import api from './api';

export class RelatoService {

    constructor() {
    }

    async Salvar(relato: Relato): Promise<Relato> {
        return await api.post(`/Relato/Salvar`, relato);
    }

    async Fechar(relato: Relato): Promise<Relato> {
        return await api.post(`/Relato/Fechar`, relato);
    }

    async Excluir(id: number): Promise<Relato> {
        return await api.delete(`/Relato/Excluir/${id}`);
    }

    async ListarPorEmpresa(idEmpresa: number): Promise<Relato[]> {
        return await api.get(`/Relato/ListarPorEmpresa/${idEmpresa}`);
    }

    async ListarAbertosPorEmpresaNoMesAtual(idEmpresa: number): Promise<Relato[]> {
        return await api.get(`/Relato/ListarAbertosPorEmpresaNoMesAtual/${idEmpresa}`);
    }

    async BuscarPorId(id: number): Promise<Relato> {
        return await api.get(`/Relato/BuscarPorId/${id}`)
    }

    async ListarPorStatus(idStatus: number,idEmpresa: number): Promise<Relato[]> {
        return api.get(`/Relato/ListarPorStatus/${idStatus}/${idEmpresa}`);
    }

    async TotalGeral(idEmpresa: number = 0): Promise<number> {
        return api.get(`/Relato/TotalGeral/${idEmpresa}`);
    }

    async TotalEmAbertoNoMesAtual(idEmpresa: number = 0): Promise<number> {
        return api.get(`/Relato/TotalEmAbertoNoMesAtual/${idEmpresa}`);
    }

    //idStatus = 0: Novo; 1: Em Aberto; 0: Novo; 1: Em Aberto; 2: Finalizado Procedente; 3: Finalizado Improcedente; 4: Cancelado
    async TotalPorStatus(idStatus: number,idEmpresa: number = 0): Promise<number> {
        return api.get(`/Relato/TotalPorStatus/${idStatus}/${idEmpresa}`);
    }
}