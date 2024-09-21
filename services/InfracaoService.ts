import { Infracao, InfracaoCombo } from 'types/Infracao';
import api from './api';

class InfracaoService{

    async Listar(): Promise<Infracao[]> {
        return await api.get(`/Infracao/Listar`);
    }

    async ListarCombo(): Promise<InfracaoCombo[]> {
        let infracoesCombo: InfracaoCombo[] = [];

        let infracoes: Infracao[] = await api.get(`/Infracao/Listar`);

        if(infracoes.length){
            for(let i = 0; i < infracoes.length;i++){
                let inf: InfracaoCombo = {
                    value: String(infracoes[i].Id),
                    label: infracoes[i].Descricao,
                    group: infracoes[i].Tipo
                }

                infracoesCombo.push(inf);
            }
        }

        return infracoesCombo;
    }

}

export default InfracaoService