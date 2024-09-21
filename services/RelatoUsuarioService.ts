import { RelatoUsuario } from "types/RelatoUsuario";
import api from "./api";

export class RelatoUsuarioService{
    constructor() {
    }

    async ListarPorRelato(idRelato: number): Promise<RelatoUsuario[]> {
        return await api.get(`/RelatoUsuario/ListarPorRelato/${idRelato}`);
    }

    async Salvar(ru: RelatoUsuario): Promise<RelatoUsuario> {
        return await api.post(`/RelatoUsuario/Salvar`, ru);
    }

    async Excluir(ru: RelatoUsuario): Promise<RelatoUsuario> {
        return await api.post(`/RelatoUsuario/Excluir`,ru);
    }
}