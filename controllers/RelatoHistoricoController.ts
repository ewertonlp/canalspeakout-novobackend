import { RelatoHistoricoService } from "services/RelatoHistoricoService";
import { RelatoHistorico } from "types/RelatoHistorico";

export class RelatoHistoricoController {

    async ListarPorRelato(idRelato: number): Promise<RelatoHistorico[]> {
        return await new RelatoHistoricoService().ListarPorRelato(idRelato);
    }

    async ListarPorProtocolo(protocolo:string): Promise<RelatoHistorico[]> {
        return await new RelatoHistoricoService().ListarPorProtocolo(protocolo);
    }

    async Salvar(relatoHistorico: RelatoHistorico): Promise<RelatoHistorico> {
        return await new RelatoHistoricoService().Salvar(relatoHistorico);
    }

    async Excluir(id: number): Promise<RelatoHistorico> {
        return await new RelatoHistoricoService().Excluir(id);
    }
}