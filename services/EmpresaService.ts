import { Empresa } from 'types/Empresa';
import api from './api';

class EmpresaService {

    constructor() {
    }

    async BuscarPorCnpj(cnpj: string): Promise<Empresa> {
        return api.get(`/Empresa/BuscarPorCnpj/${cnpj}`);
    }

    async Salvar(emp: Empresa): Promise<Empresa> {
        return await api.post(`/Empresa/Salvar`, emp);
    }

    async Inativar(emp: Empresa) {
        await api.post(`/Empresa/Inativar`, emp);
    }

    async Listar(): Promise<Empresa[]> {
        return await api.get(`/Empresa/Listar`);
    }

    async BuscarPorId(id: number): Promise<Empresa> {
        return api.get(`/Empresa/BuscarPorId?id=${id}`)
    }

    async Upload(file: File, idEmpresa: number,tipoArquivo: string): Promise<Empresa> {

        let f = new FormData();

        f.append('file', file);

        return await api.post(`/Empresa/Upload/${idEmpresa}/${tipoArquivo}`, f);
    }
}

export default EmpresaService
