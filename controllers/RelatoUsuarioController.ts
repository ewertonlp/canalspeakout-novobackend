import { RelatoUsuarioService } from 'services/RelatoUsuarioService'
import { RelatoUsuario } from 'types/RelatoUsuario'

export class RelatoUsuarioController {
    async ListarPorRelato(idRelato: number): Promise<RelatoUsuario[]> {
        return await new RelatoUsuarioService().ListarPorRelato(idRelato)
    }

    async Salvar(ru: RelatoUsuario): Promise<RelatoUsuario> {
        return await new RelatoUsuarioService().Salvar(ru)
    }

    async Excluir(ru: RelatoUsuario): Promise<RelatoUsuario> {
        return await new RelatoUsuarioService().Excluir(ru)
    }
}
