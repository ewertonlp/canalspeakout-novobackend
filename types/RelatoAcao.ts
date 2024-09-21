export class RelatoAcao{
    Id: number = 0;
    IdRelato: number = 0;
    Titulo: string = '';
    Descricao:string = '';
    IdStatus:number = 0;
    Status: string = '';
    IdUsuario: number = 0;//id do usuário responsável pela ação
    Usuario: string = '';//nome do usuário responsável pela ação
    IdUsuarioCad: number = 0;
    DataCad: Date = new Date();
    IdUsuarioAlt:number = 0;
    DataAlt: Date = new Date();
}