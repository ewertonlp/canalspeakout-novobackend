import { Area } from 'types/Area';
import api from './api';

export class AreaService {

    constructor() {
    }

    async Salvar(a: Area) {
        await api.post(`/area/Salvar`, a);
    }

    async BuscarPorId(id: number): Promise<Area> {
        return api.get(`/area/BuscarPorId/${id}`);
    }

    async Listar(idEmpresa: number): Promise<Area[]> {
        return api.get(`/area/Listar/${idEmpresa}`);
    }
}
