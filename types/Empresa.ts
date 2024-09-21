export class Empresa{
    Id: number = 0;
    Cnpj: string = '';
    Nome: string = '';
    RazaoSocial: string = '';
    Descricao: string = '';
    Ativa: boolean = true;
    UrlCodigoConduta: string = '';
    UrlLogo: string = '';
    UrlBanner: string = '';
    IdUsuarioCad: number = 0;
    DataCad?: Date = new Date();
    IdUsuarioAlt: number = 0;
    DataAlt?: Date = new Date();
    UrlRelato: string = '';

    id: string = '';
}
