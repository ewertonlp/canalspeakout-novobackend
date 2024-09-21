import { RelacaoDenuncianteEmpresa, RelacaoDenuncianteEmpresaCombo } from 'types/RelacaoDenuncianteEmpresa';
import api from './api';

class RelacaoDenuncianteEmpresaService{

    async Listar(): Promise<RelacaoDenuncianteEmpresa[]> {
        return await api.get(`/RelacaoDenuncianteEmpresa/Listar`);
    }

    async ListarCombo(): Promise<RelacaoDenuncianteEmpresaCombo[]> {
        let relacoesCombo: RelacaoDenuncianteEmpresaCombo[] = [];

        let relacoes: RelacaoDenuncianteEmpresa[] = await api.get(`/RelacaoDenuncianteEmpresa/Listar`);

        if(relacoes.length){
            for(let i = 0; i < relacoes.length;i++){
                let inf: RelacaoDenuncianteEmpresaCombo = {
                    value: String(relacoes[i].Id),
                    label: relacoes[i].Descricao
                }

                relacoesCombo.push(inf);
            }
        }
        
        return relacoesCombo;
    }
    
}

export default RelacaoDenuncianteEmpresaService