import Cookies from 'js-cookie';
import UsuarioService from 'services/UsuarioService';
import { Usuario } from 'types/Usuario';
import { UsuarioArea } from 'types/UsuarioArea';
import { EmpresaController } from './EmpresaController';

export class UsuarioController {

    async Logar(u: Usuario): Promise<Usuario> {
        try {
            const us = await new UsuarioService().Logar(u);

            if (!us.Token) {
                throw new Error('Erro: Token de acesso indefinido.');
            }

            Cookies.set('token', us.Token, {expires: 1});

            us.idEmpresa = String(us.IdEmpresa);

            const emp = await new EmpresaController().Listar();
    
            sessionStorage.setItem('usuarioSpeakOut', JSON.stringify(us));
            sessionStorage.setItem('empresas',JSON.stringify(emp));

            location.href = '/home';
            return us;
        } 
        catch (error) {
            throw error;
        }
    }

    async Listar(us?: Usuario): Promise<Usuario[]> {

        const u = new Usuario();

        u.IdEmpresa = new UsuarioController().GetUsuarioLogado().IdEmpresa;

        if(us && us != null){

            u.Cpf = us.Cpf;
            u.Nome = us.Nome;
            u.Email = us.Email;
        }

        return await new UsuarioService().Listar(u);
    }

    async BuscarPorId(id: number): Promise<Usuario> {
        
        return await new UsuarioService().BuscarPorId(id);
    }

    async Salvar(us: any): Promise<Usuario> {

        const u = new Usuario();

        u.Id = isNaN(us.Id) ? 0 : Number(us.Id);
        u.Nome = String(us.Nome);
        u.Cpf = us.Cpf && String(us.Cpf) != '' ? String(us.Cpf) : '';
        u.Email = String(us.Email);
        u.Senha = us.Senha && String(us.Senha) != '' ? us.Senha: null;
        u.Ativo = true;
        u.Adm = String(us.Adm) == 'true';
        u.RecebeNotificacao = String(us.RecebeNotificacao) == 'true';
        u.RecebeNotificacaoRelato = String(us.RecebeNotificacaoRelato) == 'true';
        u.IdEmpresa = this.InformacaoUsuarioLogado().IdEmpresa;
        u.Comite = us.Comite && us.Comite == true;

        console.log('usuario no controller');

        console.log(u);

        if(us.areas && us.areas != ''){

            const areas = Array.from(us.areas);

            u.Areas = [];

            for(let i = 0; i < areas.length;i++){
                const a = new UsuarioArea();
                a.IdArea = Number(areas[i]);
                u.Areas.push(a);
            }
        }

        return await new UsuarioService().Salvar(u);
    }

    async Inativar(id: number): Promise<Usuario> {

        return await new UsuarioService().Inativar(id);
    }

    InformacaoUsuarioLogado():Usuario {
        
        if(!sessionStorage.getItem('usuarioSpeakOut') || 
            sessionStorage.getItem('usuarioSpeakOut') === null || 
            sessionStorage.getItem('usuarioSpeakOut') == '') return new Usuario();

        const s = sessionStorage.getItem('usuarioSpeakOut');
        const u: Usuario = JSON.parse(String(s)) as Usuario;
        return u;
    }

    async AlteraSenha(u: Usuario) {
        
        return await new UsuarioService().AlteraSenha(u);
    }

    TrocaEmpresa(idEmpresa: string){

        const u = this.GetUsuarioLogado();

        u.idEmpresa = idEmpresa;

        u.IdEmpresa = Number(idEmpresa);

        sessionStorage.setItem('usuarioSpeakOut', JSON.stringify(u));
    }

    Logout(){
        Cookies.remove('token');
        sessionStorage.clear();
        localStorage.clear();
        location.href = '/login';
    }

    GetUsuarioLogado(): Usuario{
        
        const u = sessionStorage.getItem('usuarioSpeakOut');
        
        const token = Cookies.get('token');

        if (!u || !token) {
            this.Logout();
            return new Usuario();
        }

        return JSON.parse(u);
    }
}
