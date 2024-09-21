import { NotificacaoUsuario } from "./NotificacaoUsuario";
import { UsuarioArea } from "./UsuarioArea";
import { RelatoUsuario } from "./RelatoUsuario";


export class Usuario {
    Id: number = 0;
    Nome: string = '';
    Cpf: string = '';
    Email: string = '';
    Senha: string = '';
    IdEmpresa: number = 0;
    Empresa: string = '';
    Ativo: boolean = false;
    Adm: boolean = false;
    Master: boolean = false;
    RecebeNotificacao: boolean = false;
    RecebeNotificacaoRelato: boolean = false;
    Areas: UsuarioArea[] = [];
    Notificacoes: NotificacaoUsuario[] = [];
    Comite: boolean = false;
    Token: string = '';

    //campos para alteração de senha
    SenhaAtual: string = '';
    SenhaConfirmacao: string = '';

    idEmpresa: string = '';

    RelatoUsuario: RelatoUsuario[];
}