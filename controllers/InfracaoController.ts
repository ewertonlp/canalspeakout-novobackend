import InfracaoService from "services/InfracaoService";
import { Infracao, InfracaoCombo } from "types/Infracao";

export class InfracaoController{

    async Listar(): Promise<Infracao[]> {
        return await new InfracaoService().Listar();
    }

    async ListarCombo(): Promise<InfracaoCombo[]> {
        return await new InfracaoService().ListarCombo();
    }
}