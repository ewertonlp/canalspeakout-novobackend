import { RelatoArquivo } from "types/RelatoArquivo";
import api from './api';

export class RelatoArquivoService{

    async Salvar(file: File, idRelato: number,operacao: number = 0, idOperacao: number = 0): Promise<RelatoArquivo> {

        let f = new FormData();

        f.append('file', file);

        try{
            return await api.post(`/RelatoArquivo/Salvar/${idRelato}/${operacao}/${idOperacao}`, f);
        }

        catch(e){
            throw e;
        }
    }

    async ListarPorRelato(idRelato: number): Promise<RelatoArquivo[]>{

        try{
            return await api.get(`/RelatoArquivo/ListarPorRelato/${idRelato}`);
        }

        catch(e){
            throw e;
        }
    }

    async BuscarPorId(id: number): Promise<RelatoArquivo>{

        try{
            return await api.get(`/RelatoArquivo/BuscarPorId/${id}`);
        }

        catch(e){
            throw e;
        }
    }
}