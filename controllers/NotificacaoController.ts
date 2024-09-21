import { NotificacaoService } from "services/NotificacaoService";
import { NotificacaoUsuario } from "types/NotificacaoUsuario";
import { UsuarioController } from "./UsuarioController";

export class NotificacaoController {

    async ListarNaoVisualizadasPorUsuario(): Promise<NotificacaoUsuario[]> {
        let idUsuario = new UsuarioController().InformacaoUsuarioLogado().Id;

        if(idUsuario == 0) return [];
        
        return await new NotificacaoService().ListarNaoVisualizadasPorUsuario(idUsuario);
    }

    async MarcarComoVisualizada(nu: NotificacaoUsuario): Promise<NotificacaoUsuario> {
        return await new NotificacaoService().MarcarComoVisualizada(nu);
    }
}