export class NotificacaoUsuario{
    Id: number = 0;
    IdUsuario: number = 0;
    IdNotificacao: number = 0;
    IdRelato: number = 0;
    Titulo: string = '';//título da notificação, que deve ser exibido no "sininho"
    Descricao: string = '';
    Visualizada: boolean = false;
    Data: Date = new Date();
}