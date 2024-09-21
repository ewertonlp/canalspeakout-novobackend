import { RelatoArquivoService } from "services/RelatoArquivoService";
import { RelatoArquivo } from "types/RelatoArquivo";

export class RelatoArquivoController{

    async Salvar(fs: File[],idRelato: number,operacao: number = 0, idOperacao: number = 0): Promise<boolean> {

        for(let i = 0; i < fs.length; i++){

            try{

                let r = await new RelatoArquivoService().Salvar(fs[i],idRelato,operacao,idOperacao);

                if(r === null || r.Id <= 0)
                {
                    console.log(`O arquivo ${fs[i].name} não foi salvo.`);
                    return false;
                }
            }

            catch(e){
                throw e;
            }
        }

        return true;
    }

    async ListarPorRelato(idRelato: number): Promise<RelatoArquivo[]>{

        try{
            return await new RelatoArquivoService().ListarPorRelato(idRelato);
        }

        catch(e){
            throw e;
        }
    }

    async BuscarPorId(id: number): Promise<RelatoArquivo>{

        try{
            return await new RelatoArquivoService().BuscarPorId(id);
        }

        catch(e){
            throw e;
        }
    }
}