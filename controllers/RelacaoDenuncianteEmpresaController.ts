import RelacaoDenuncianteEmpresaService from "services/RelacaoDenuncianteEmpresaService";
import { RelacaoDenuncianteEmpresa, RelacaoDenuncianteEmpresaCombo } from "types/RelacaoDenuncianteEmpresa";

export class RelacaoDenuncianteEmpresaController{
    
    async Listar(): Promise<RelacaoDenuncianteEmpresa[]> {
        return await new RelacaoDenuncianteEmpresaService().Listar();
    }

    async ListarCombo(): Promise<RelacaoDenuncianteEmpresaCombo[]> {
        return await new RelacaoDenuncianteEmpresaService().ListarCombo();
    }
}