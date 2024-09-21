export class RelatoArquivo{
    Id: number = 0;
    IdRelato: number = 0;
    Nome: string = '';
    Url: string = '';

    /// identificação do arquivo por tipo de operação
    /// 0: ao relato em si; 1: a uma ação sobre o relato; 2: a um comentário / histórico
    Operacao: number = 0;

/// o id da operação em si. Quando forem arquivos associados diretamente ao relato, esse valor será zero
/// caso contrário, irá conter o id de uma ação ou de um comentário
    IdOperacao: number = 0;
}