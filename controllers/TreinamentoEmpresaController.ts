import { TreinamentoEmpresaService } from 'services/TreinamentoEmpresaService';
import { TreinamentoEmpresa } from 'types/TreinamentoEmpresa';

export class TreinamentoEmpresaController {

    async BuscarPorId(id: number): Promise<TreinamentoEmpresa> {

        return await new TreinamentoEmpresaService().BuscarPorId(id);
    }

    async Listar(): Promise<TreinamentoEmpresa[]> {

        return await new TreinamentoEmpresaService().Listar();
    }
}
