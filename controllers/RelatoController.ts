import { RelatoService } from 'services/RelatoService';
import { Relato } from 'types/Relato';
import { UsuarioController } from './UsuarioController';

export class RelatoController {

    async ListarPorEmpresa(idEmpresa): Promise<Relato[]> {

        const r =  await new RelatoService().ListarPorEmpresa(idEmpresa);

        if(r !== null)
        {
            for(let i = 0; i < r.length;i++){
                r[i].id = r[i].Id.toString();
            }
        }

        return r;
    }

    async ListarAbertosPorEmpresaNoMesAtual(idEmpresa: number): Promise<Relato[]> {

        const r = await new RelatoService().ListarAbertosPorEmpresaNoMesAtual(idEmpresa);

        if(r !== null)
        {
            for(let i = 0; i < r.length;i++){
                r[i].id = r[i].Id.toString();
            }
        }

        return r;
    }

    async ListarPorStatus(idStatus: number, idEmpresa: number): Promise<Relato[]> {

        const r = await new RelatoService().ListarPorStatus(idStatus, idEmpresa);

        if(r !== null)
        {
            for(let i = 0; i < r.length;i++){
                r[i].id = r[i].Id.toString();
            }
        }

        return r;
    }

    async TotalGeral(idEmpresa: number = 0): Promise<number> {
        return await new RelatoService().TotalGeral(idEmpresa);
    }

    async TotalEmAbertoNoMesAtual(idEmpresa: number = 0): Promise<number> {
        return await new RelatoService().TotalEmAbertoNoMesAtual(idEmpresa);
    }

    //idStatus = 0: Novo; 1: Em Aberto; 2: 0: Novo; 1: Em Aberto; 2: Finalizado Procedente; 3: Finalizado Improcedente; 4: Cancelado
    async TotalPorStatus(idStatus: number, idEmpresa: number = 0): Promise<number> {
        return await new RelatoService().TotalPorStatus(idStatus, idEmpresa);
    }

    async BuscarPorId(id: number): Promise<Relato> {
        
        const r = await new RelatoService().BuscarPorId(id);

        if(r !== null) r.id = r.Id.toString();

        return r;
    }

    async Salvar(r: any): Promise<Relato> {

        const re = new Relato();

        re.IdEmpresa = Number(r.IdEmpresa);
        re.Id = r.Id && !isNaN(r.Id) ? Number(r.Id) : 0;
        re.IdSensibilidade = r.IdSensibilidade && !isNaN(r.IdSensibilidade) ? Number(r.IdSensibilidade) : 0;
        re.IdGrauCerteza = r.IdGrauCerteza && !isNaN(r.IdGrauCerteza) ? Number(r.IdGrauCerteza) : 0;
        re.IdRelacaoDenuncianteEmpresa =
            r.IdRelacaoDenuncianteEmpresa && !isNaN(r.IdRelacaoDenuncianteEmpresa)
                ? Number(r.IdRelacaoDenuncianteEmpresa)
                : 0;
        re.IdInfracao = r.IdInfracao && !isNaN(r.IdInfracao) ? Number(r.IdInfracao) : 0;
        re.IdRecorrencia = r.IdRecorrencia && !isNaN(r.IdRecorrencia) ? Number(r.IdRecorrencia) : 0;
        re.IdStatus = r.IdStatus && !isNaN(r.Status) ? Number(r.IdStatus) : 0;
        re.IdUsuarioCad = new UsuarioController().InformacaoUsuarioLogado().Id;
        re.IdUsuarioAlt = new UsuarioController().InformacaoUsuarioLogado().Id;

        re.Identificado = r.Identificado && String(r.Identificado) == 'true';
        re.TemTestemunha = r.TemTestemunha && String(r.TemTestemunha) == 'true';

        re.DetalheSemTestemunha =
            r.DetalheSemTestemunha && String(r.DetalheSemTestemunha) != '' ? String(r.DetalheSemTestemunha) : '';
        re.NomeDenunciante = r.NomeDenunciante && String(r.NomeDenunciante) != '' ? String(r.NomeDenunciante) : '';
        re.EmailDenunciante = r.EmailDenunciante && String(r.EmailDenunciante) != '' ? String(r.EmailDenunciante) : '';
        re.TelefoneDenunciante =
            r.TelefoneDenunciante && String(r.TelefoneDenunciante) != '' ? String(r.TelefoneDenunciante) : '';
        re.CargoDenunciante = r.CargoDenunciante && String(r.CargoDenunciante) != '' ? String(r.CargoDenunciante) : '';
        re.EmpresaDenunciante =
            r.EmpresaDenunciante && String(r.EmpresaDenunciante) != '' ? String(r.EmpresaDenunciante) : '';
        re.HorarioContato = r.HorarioContato && String(r.HorarioContato) != '' ? String(r.HorarioContato) : '';
        re.Evidencia = r.Evidencia && String(r.Evidencia) != '' ? String(r.Evidencia) : '';
        re.NomeInfrator = r.NomeInfrator && String(r.NomeInfrator) != '' ? String(r.NomeInfrator) : '';
        re.LocalInfracao = r.LocalInfracao && String(r.LocalInfracao) != '' ? String(r.LocalInfracao) : '';
        re.DataInfracao =
            r.DataInfracao && String(r.DataInfracao) != '' ? new Date(r.DataInfracao).toLocaleDateString() : '';
        re.Testemunhas = r.Testemunhas && String(r.Testemunhas) != '' ? String(r.Testemunhas) : ''
        re.AreaDenunciante = r.AreaDenunciante && String(r.AreaDenunciante) != '' ? String(r.AreaDenunciante) : '';
        re.InfracaoEspecifica = r.InfracaoEspecifica && String(r.AreaDenunciante) != '' ? String(r.AreaDenunciante) : '';
        re.RelacaoDenuncianteEmpresaEspecifica =
            r.RelacaoDenuncianteEmpresaEspecifica && String(r.RelacaoDenuncianteEmpresaEspecifica) != ''
                ? String(r.RelacaoDenuncianteEmpresaEspecifica)
                : '';

        return await new RelatoService().Salvar(re);
    }

    async Fechar(id: number): Promise<Relato> {
        const r = new Relato()

        r.Id = id

        r.IdUsuarioAlt = new UsuarioController().GetUsuarioLogado().Id

        return await new RelatoService().Fechar(r)
    }

    async Excluir(id: number): Promise<Relato> {
        return await new RelatoService().Excluir(id)
    }
}
