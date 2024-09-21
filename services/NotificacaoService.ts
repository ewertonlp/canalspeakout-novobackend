import { NotificacaoUsuario } from "types/NotificacaoUsuario";
import api from "./api";

export class NotificacaoService {

    constructor() {
    }

    async ListarNaoVisualizadasPorUsuario(idUsuario: number): Promise<NotificacaoUsuario[]> {
        return await api.get(`/Notificacao/ListarNaoVisualizadasPorUsuario/${idUsuario}`);
    }

    async MarcarComoVisualizada(nu: NotificacaoUsuario):Promise<NotificacaoUsuario> {
        return (await api.post(`/Notificacao/MarcarComoVisualizada`,nu)).data;
    }
}