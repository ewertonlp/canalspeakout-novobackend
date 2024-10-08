import { RelatoUsuario } from "./RelatoUsuario";

export class Relato {
    Id = 0;
    IdEmpresa = 0;
    Empresa = '';
    Protocolo = '';
    Identificado = false;
    IdSensibilidade = 0;
    Sensibilidade = '';
    IdGrauCerteza = 0;
    GrauCerteza = '';
    IdRecorrencia = 0;
    Recorrencia = '';
    IdStatus = 0;
    Status = '';
    EmailDenunciante = '';
    NomeDenunciante = '';
    TelefoneDenunciante = '';
    AreaDenunciante = '';
    CargoDenunciante = '';
    EmpresaDenunciante = '';
    IdRelacaoDenuncianteEmpresa = 0;
    RelacaoDenuncianteEmpresa = '';
    RelacaoDenuncianteEmpresaEspecifica = '';
    Evidencia = '';
    HorarioContato = '';
    IdInfracao = 0;
    Infracao = '';
    InfracaoEspecifica = '';
    CodigoEtica = '';
    NomeInfrator = '';
    LocalInfracao = '';
    DataInfracao = '';
    TemTestemunha = false;
    Testemunhas = '';
    DetalheSemTestemunha = '';
    Fechado = false;
    DataFechameto = '';
    IdUsuarioCad = 0;
    UsuarioCad = '';
    IdUsuarioAlt = 0;
    UsuarioAlt = '';
    DataCad: Date = new Date();
    DataAlt: Date = new Date();
    DataCadPtBr: string = '';
    DataFechamentoPtBr: string = '';
    DiasEmAberto: number = 0;
    id: string = '';
    UsuarioTemp: RelatoUsuario [];

}