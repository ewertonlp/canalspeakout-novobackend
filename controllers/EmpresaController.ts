import EmpresaService from 'services/EmpresaService';
import { Empresa } from 'types/Empresa';
import { UsuarioController } from './UsuarioController';

export class EmpresaController {

    async BuscarPorCnpj(cnpj: string): Promise<Empresa> {

        return new EmpresaService().BuscarPorCnpj(cnpj);
    }

    async Listar(): Promise<Empresa[]> {
        
        let emp = await new EmpresaService().Listar();

        if(emp.length){
            for(let i = 0; i < emp.length;i++){
                emp[i].id = String(emp[i].Id);
            }
        }
        
        return emp;
    }

    async BuscarPorId(id: number): Promise<Empresa> {

        return await new EmpresaService().BuscarPorId(id);
    }

    async Salvar(e: any): Promise<Empresa> {

        let emp = new Empresa();

        emp.Ativa = Boolean(e.Ativa);
        emp.Id = !e.Id || e.Id == '' || e.Id === null ? 0 : parseInt(e.Id);
        emp.Cnpj = e.Cnpj;
        emp.Nome = e.Nome;
        emp.RazaoSocial = e.RazaoSocial;
        emp.Descricao = e.Descricao;
        emp.UrlRelato = e.UrlRelato;
        emp.UrlCodigoConduta = e.UrlCodigoConduta;
        emp.UrlRelato = '';
        emp.IdUsuarioCad = new UsuarioController().GetUsuarioLogado().Id;
        emp.IdUsuarioAlt = emp.IdUsuarioCad;

        emp = await new EmpresaService().Salvar(emp);

        let emps = await this.Listar();

        sessionStorage.setItem('empresas',JSON.stringify(emps));

        return emp;
    }

    async Inativar(emp: Empresa) {
        
        emp.IdUsuarioCad = new UsuarioController().GetUsuarioLogado().Id;
        emp.IdUsuarioAlt = emp.IdUsuarioCad;
        
        return await new EmpresaService().Inativar(emp);
    }

    GetEmpresas(){

        let s = String(sessionStorage.getItem('empresas'));

        let emp: Empresa[] = JSON.parse(s) as Empresa[];

        return emp;
    }

    GetEmpresasAtivas(){

        let emp = this.GetEmpresas();

        let empAtiva: Empresa[] = [];

        let u = new UsuarioController().GetUsuarioLogado();
        
        for(let i = 0; i < emp.length;i++){

            if(emp[i].Ativa){

                if(u.Master || emp[i].Id == u.IdEmpresa){//usuário master pode enxergar e selecionar qualquer empresa
                    empAtiva.push(emp[i]);
                }
            }
        }

        return empAtiva;
    }

    GetEmpresaPorId(id: number):Empresa{

        let emp = this.GetEmpresas();

        let e: Empresa = new Empresa;

        for(let i = 0; i < emp.length; i++){
            if(emp[i].Id == id){
                e = emp[i];
                break;
            }
        }

        return e;
    }

    async Upload(arquivo: File, idEmpresa: number,tipoArquivo: string): Promise<Empresa> {

        return await new EmpresaService().Upload(arquivo,idEmpresa,tipoArquivo);
    }
}
