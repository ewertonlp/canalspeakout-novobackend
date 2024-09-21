import { AreaService } from 'services/AreaService';
import { Area } from 'types/Area';
import { UsuarioController } from './UsuarioController';

export class AreaController {

    async Salvar(a: Area) {
        
        a.IdEmpresa = new UsuarioController().GetUsuarioLogado().IdEmpresa;

        await new AreaService().Salvar(a);
    }

    async BuscarPorId(id: number): Promise<Area> {

        return await new AreaService().BuscarPorId(id);
    }

    async Listar(): Promise<Area[]> {

        return await new AreaService().Listar(new UsuarioController().GetUsuarioLogado().IdEmpresa);
    }
}
