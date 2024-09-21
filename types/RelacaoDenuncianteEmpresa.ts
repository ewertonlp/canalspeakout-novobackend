export class RelacaoDenuncianteEmpresa{
    Id: number = 0;
    Descricao: string = '';
    Especificar: boolean = false;
}

export class RelacaoDenuncianteEmpresaCombo{//retorna as relações, porém, com nomes que facilitam o carregamento de um htmlSelect
    value: string = '';
    label: string = '';
}