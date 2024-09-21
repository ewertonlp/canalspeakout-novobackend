import { RelatoAcaoService, } from 'services/RelatoAcaoService';
import { RelatoAcao } from 'types/RelatoAcao';
import { RelatoArquivoController } from './RelatoArquivoController';
import { UsuarioController } from './UsuarioController';

export class RelatoAcaoController {

    async ListarPorRelato(idRelato: number): Promise<RelatoAcao[]> {
        return await new RelatoAcaoService().ListarPorRelato(idRelato);
    }

    async BuscarPorId(id: number): Promise<RelatoAcao> {
        return await new RelatoAcaoService().BuscarPorId(id);
    }

    async Salvar(ra: any, fs: File[]): Promise<RelatoAcao> {

        let r = new RelatoAcao();

        r.Id = Number(ra.Id);
        r.IdRelato = Number(ra.IdRelato);
        r.Titulo = String(ra.Titulo);
        r.Descricao = String(ra.Descricao);
        r.IdStatus = Number(ra.IdStatus);
        
        r.IdUsuarioCad = new UsuarioController().GetUsuarioLogado().Id;
        r.IdUsuarioAlt = new UsuarioController().GetUsuarioLogado().Id;

        r = await new RelatoAcaoService().Salvar(r);

        if(fs && fs.length > 0){
            await new RelatoArquivoController().Salvar(fs,r.IdRelato,1,r.Id);
        }

        return r;
    }

    async Excluir(id: number): Promise<RelatoAcao> {
        return await new RelatoAcaoService().Excluir(id);
    }
}