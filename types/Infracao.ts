export class Infracao{
    Id: number = 0;
    Descricao: string = '';
    IdTipo: number = 0;
    Tipo: string = '';
}

export class InfracaoCombo{//retorna as infrações, porém, com nomes que facilitam o carregamento de um htmlSelect
    value: string = '';
    label: string = '';
    group: string = '';
}