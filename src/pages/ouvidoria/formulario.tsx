import { Divider, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RelatoArquivoController } from 'controllers/RelatoArquivoController';
import { RelatoController } from 'controllers/RelatoController';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Loading from 'src/components/Loading';
import ApolloForm, { ApolloFormSchemaComponentType, ApolloFormSchemaGroup, ApolloFormSchemaItem } from 'src/components/apollo-form/ApolloForm.component';
import AppBar from 'src/components/ouvidoria/AppBar';
import NoCompany from 'src/components/ouvidoria/NoCompany';
import { SuccessMessageModal } from 'src/components/ouvidoria/SuccessMessageModal';
import TermosAceite from 'src/components/ouvidoria/TermoAceite';
import { Empresa } from 'types/Empresa';

const Form = ({ values }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [arquivos, setArquivos] = useState<File[]>();
    const [infracao, setInfracao] = useState<string>();
    const [naoTestemunhasOcorrencia, setNaoTestemunhasOcorrencia] = useState<string>();

    const [termoAceito, setTermAccepted] = useState(false);

    const router = useRouter();
    const cnpj = router.query.company;

    const [empresa, setInfoEmpresa] = useState<Empresa>();
    const [noCompany, setNoCompany] = useState(false);

    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>([]);

    const [checkTestemunhas, setCheckTestemunhas] = useState<string>();
    const [checkIdentification, setCheckIdentification] = useState<string>('');
    const [checkTipoDenuncia, setCheckTipoDenuncia] = useState<string>();
    const [checkRelacao, setCheckRelacao] = useState<string>();

    const [protocol, setProtocol] = useState<string>('');

    const [openSuccesMessageModal, setOpenSuccessMessageModal] = useState<boolean>(false);

    const theme = useTheme();

    const backgroundColor =
        theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.paper;

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2';

    const salvar = async relato => {

        if (!empresa) return;

        if (relato.Identificado == 'true') {
            const regex = /\(\d\d\)\d\d\d\d\d-\d\d\d\d/i;

            if (!regex.test(relato.TelefoneDenunciante)) {
                enqueueSnackbar('Telefone inválido!', { variant: 'error' });
                return;
            }
        }

        relato.IdEmpresa = empresa.Id;

        try {

            let resp = await new RelatoController().Salvar(relato);

            setProtocol(resp.Protocolo ?? '');

            setOpenSuccessMessageModal(true);

            if (arquivos && arquivos.length > 0) {
                        
                try {

                    await new RelatoArquivoController().Salvar(arquivos,relato.Id);
                    enqueueSnackbar('Arquivo enviado com sucesso', { variant: 'success' });
                }

                catch (error) {
                    console.error('Erro ao fazer upload do arquivo:', error.error);
                    enqueueSnackbar(`Erro ao fazer upload do arquivo : ${error.error}`, { variant: 'error' });
                }
            }
        } 
        catch (error) {
            enqueueSnackbar('Erro ao enviar formulário', { variant: 'error' });
        }
    }

    useEffect(() => {
        
        if (!router.isReady) return;

        const getInfo = () => {

            setLoading(true);

            if (String(cnpj).length && String(cnpj).length == 18) {

                let emp = new Empresa();
                let s = String(sessionStorage.getItem('idEmpresa'));
                emp.Id = parseInt(s);
                setInfoEmpresa(emp);
                setNoCompany(false);
                setLoading(false);
                if (Cookies.get('termoAceito') === 'sim') setTermAccepted(true);
            } 

            else {
                enqueueSnackbar('Empresa não encontrada!', { variant: 'error' });
                setNoCompany(true);
                setLoading(false);
                return;
            }
        }
        
        getInfo()
    }, [router.isReady])

    const infracoes = [
        {
            value : '1',
            label : 'Assédio (Moral e/ou sexual)',
            group : 'Assédio'
        },
        {
            value : '2',
            label : 'Agressões físicas',
            group : 'Violência'
        },
        {
            value : '3',
            label : 'Discriminação étnica',
            group : 'Discriminação'
        },
        {
            value : '4',
            label : 'Discriminação racial',
            group : 'Discriminação'
        },
        {
            value : '5',
            label : 'Discriminação social',
            group : 'Discriminação'
        },
        {
            value : '6',
            label : 'Discriminação sexual',
            group : 'Discriminação'
        },
        {
            value : '7',
            label : 'Discriminação física',
            group : 'Discriminação'
        },
        {
            value : '10',
            label : 'Favorecimento em Processo de Recrutamento e Seleção',
            group : 'Favorecimento'
        },
        {
            value : '8',
            label : 'Suborno',
            group : 'Favorecimento'
        },
        {
            value : '9',
            label : 'Irregularidade financeira',
            group : 'Favorecimento'
        },
        {
            value : '11',
            label : 'Pessoais',
            group : 'Subtração de bens ou dinheiro'
        },
        {
            value : '12',
            label : 'Da Empresa',
            group : 'Subtração de bens ou dinheiro'
        },
        {
            value : '13',
            label : 'Depreciação',
            group : 'Utilização indevida'
        },
        {
            value : '14',
            label : 'Uso indevido do patrimônio da empresa',
            group : 'Utilização indevida'
        },
        {
            value : '15',
            label : 'Uso indevido da marca',
            group : 'Utilização indevida'
        },
        {
            value : '16',
            label : 'Uso indevido de recursos da empresa',
            group : 'Utilização indevida'
        },
        {
            value : '17',
            label : 'Utilização indevida de informações privilegiadas',
            group : 'Utilização indevida'
        },
        {
            value : '18',
            label : 'Violação de Leis Ambientais',
            group : 'Meio ambiente'
        },
        {
            value : '19',
            label : 'Falsificação de documento da empresa',
            group : 'Falsificação'
        },
        {
            value : '20',
            label : 'Criar/Ignorar perigos ambientais ou de segurança',
            group : 'Perigos'
        },
        {
            value : '21',
            label : 'Conduta inadequada dos nossos motoristas de trânsito',
            group : 'Conduta'
        },
        {
            value : '22',
            label : 'Conduta do colaborador',
            group : 'Conduta'
        },
        {
            value : '23',
            label : 'Conduta do gestor',
            group : 'Conduta'
        },
        {
            value : '24',
            label : 'Relações com a comunidade',
            group : 'Relações'
        },
        {
            value : '25',
            label : 'Relações com o Setor Público',
            group : 'Relações'
        },
        {
            value : '26',
            label : 'Relações com o Sindicato',
            group : 'Relações'
        },
        {
            value : '27',
            label : 'Vazamento de dados Pessoais',
            group : 'Outros'
        },
        {
            value : '28',
            label : 'Corrupção',
            group : 'Outros'
        },
        {
            value : '29',
            label : 'Conflito de interesses',
            group : 'Outros'
        },
        {
            value : '30',
            label : 'Fraude',
            group : 'Outros'
        },
        {
            value : '31',
            label : 'Infração aos direitos humanos e discriminação',
            group : 'Outros'
        },
        {
            value : '32',
            label : 'Descumprimento de Políticas, Normas ou Procedimentos Internos',
            group : 'Outros'
        },
        {
            value : '33',
            label : 'Destruição ou danos de ativos da empresa',
            group : 'Outros'
        },
        {
            value : '34',
            label : 'Trabalho infantil, escravo ou forçado',
            group : 'Outros'
        },
        {
            value : '35',
            label : 'Uso de álcool, drogas ou porte e comércio de armas',
            group : 'Outros'
        },
        {
            value : '36',
            label : 'Outro - especificar',
            group : 'Outros'
        }
    ]

    const groups: ApolloFormSchemaGroup[] = [
        {
            name: 'Identificação:',
            key: 'identification',
            type: 'label',
            variant: 'h5',
            visible: true,
        },
        {
            name: 'Dados pessoais:',
            key: 'personalData',
            type: 'label',
            variant: 'body1',
            subgroup: 'identification',
            visible: checkIdentification != '',
        },
        {
            name: 'Relação com a empresa:',
            key: 'relationForBusiness',
            type: 'collapse',
            variant: 'h5',
            visible: true,
        },
        {
            name: `Relatar infração:`,
            key: 'raleteInfration',
            type: 'collapse',
            variant: 'h5',
        },
        {
            name: `Sobre seu relato:`,
            key: 'infoRelate',
            type: 'collapse',
            variant: 'h5',
        },
    ]

    const formSchema: ApolloFormSchemaItem[] = [
        {
            name: 'Identificado',
            label: 'Você deseja se identificar?',
            ui: { grid: 6 },
            componenttype: ApolloFormSchemaComponentType.SELECT,
            groupKey: 'identification',
            required: true,
            options: [
                {
                    value: 'false',
                    label: 'Não',
                },
                {
                    value: 'true',
                    label: 'Sim',
                },
            ],
            onChange(e) {
                setCheckIdentification(e.target.value)
            },
        },
        {
            name: 'NomeDenunciante',
            label: 'Qual o seu nome?',
            ui: { grid: 6 },
            required: true,
            groupKey: 'personalData',
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'CargoDenunciante',
            label: 'Qual o seu cargo?',
            ui: { grid: 6 },
            required: true,
            groupKey: 'personalData',
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'TelefoneDenunciante',
            label: 'Qual o seu telefone',
            ui: { grid: 6 },
            required: true,
            groupKey: 'personalData',
            mask: '(99)99999-9999',
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'HorarioContato',
            label: 'Qual o melhor horário para contato?',
            ui: { grid: 6 },
            groupKey: 'personalData',
            required: true,
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'EmailDenunciante',
            label: 'Qual o seu email?',
            groupKey: 'personalData',
            ui: { grid: checkIdentification && checkIdentification == 'true' ? 6 : 12 },
            required: true,
            componenttype: checkIdentification
                ? ApolloFormSchemaComponentType.EMAIL
                : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'AreaDenunciante',
            label: 'Área de atuação: ',
            groupKey: 'personalData',
            ui: { grid: 6 },
            required: true,
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'IdRelacaoDenuncianteEmpresa',
            label: 'Qual a sua relação com a Empresa',
            groupKey: 'relationForBusiness',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                {
                    value: '1',
                    label: 'Colaborador da empresa',
                },
                {
                    value: '2',
                    label: 'Ex-colaborador da empresa',
                },
                {
                    value: '3',
                    label: 'Cliente da empresa',
                },
                {
                    value: '4',
                    label: 'Fornecedor / Prestador/ Credenciado da empresa',
                },
                {
                    value: '5',
                    label: 'Comunidade no entorno da empresa',
                },
                {
                    value: '6',
                    label: 'Outro - Especificar',
                },
            ],
            onChange(e) {
                setCheckRelacao(e.target.value)
            },
        },
        {
            name: 'RelacaoDenuncianteEmpresaEspecifica',
            label: 'Especifique o tipo de relação',
            groupKey: 'relationForBusiness',
            ui: { grid: 6 },
            required: true,
            componenttype:
                checkRelacao && checkRelacao == '6'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'Infracao',
            label: 'Qual infração do código de ética ocorreu? Link do Código de ética',
            groupKey: 'raleteInfration',
            ui: { grid: 6 },
            required: true,
            renderComponent() {
                return (
                    <Grid>
                        <InputLabel sx={{ paddingLeft: '5px' }}>
                            Qual infração do código de ética ocorreu?{' '}
                            <a
                                style={{
                                    textDecoration: 'none',
                                    color: '#3566d1',
                                }}
                                href={empresa?.UrlCodigoConduta}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Link do código de ética
                            </a>
                        </InputLabel>
                        <TextField
                            onChange={e => setInfracao(e.target.value)}
                            rows={2}
                            multiline
                            type="text"
                            placeholder="Informe aqui o código de ética"
                            sx={{
                                width: '100%',
                                borderRadius: '10px',
                                backgroundColor: backgroundColor,
                                border: `1px solid ${borderColor}`,
                            }}
                        />
                    </Grid>
                )
            },
        },
        {
            name: 'EmpresaDenunciante',
            label: 'Em qual empresa você trabalha?',
            groupKey: 'raleteInfration',
            ui: { grid: 6 },
            required: true,
            // componenttype: ApolloFormSchemaComponentType.TEXTAREA,
            componenttype:
                checkIdentification == 'true'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'IdInfracao',
            label: 'Qual o tipo de denúncia você deseja relatar?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECTSEARCH,
            options: infracoes,
            onChangeSelectSearch(e) {
                if (e) setCheckTipoDenuncia(e.value)
            },
        },
        {
            name: 'InfracaoEspecifica',
            label: 'Especifique o tipo de denúncia',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype:
                checkTipoDenuncia === '36'
                    ? ApolloFormSchemaComponentType.TEXT
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'LocalInfracao',
            label: 'Onde ocorreu o incidente?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.TEXTAREA,
        },
        {
            name: 'DataInfracao',
            label: 'Quando esse fato ocorreu?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.DATE,
        },
        {
            name: 'NomeInfrator',
            label: 'Quem cometeu o incidente? Informe o nome da pessoa e, se possível, mais detalhes como o sobrenome, área e cargo',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.TEXTAREA,
        },
        {
            name: 'IdRecorrencia',
            label: 'Esse fato continua ocorrendo?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                {
                    label: 'Sim',
                    value: '1',
                },
                {
                    label: 'Não',
                    value: '2',
                },
                {
                    label: 'Talvez',
                    value: '3',
                },
            ],
        },
        {
            name: 'TemTestemunha',
            label: 'Havia testemunhas?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                {
                    label: 'Sim',
                    value: 'true',
                },
                {
                    label: 'Não',
                    value: 'false',
                },
            ],
            onChange(e) {
                setCheckTestemunhas(e.target.value)
            },
        },
        {
            name: 'Testemunhas',
            label: 'Cite o nome das testemunhas que estavam presentes',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype:
                checkTestemunhas && checkTestemunhas == 'true'
                    ? ApolloFormSchemaComponentType.TEXTAREA
                    : ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'DetalheSemTestemunha',
            label: '',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            renderComponent() {
                if (checkTestemunhas && checkTestemunhas == 'false')
                    return (
                        <Grid>
                            <InputLabel sx={{ paddingLeft: '5px', wordBreak: 'break-all', whiteSpace: 'unset' }}>
                                Por favor, descreva com o maior nível de detalhes possível o que aconteceu, indicando
                                o(s) nome(s) da(s) pessoa(s) envolvida(s) entre outras informações que você julgar
                                pertinentes. * 0/12.000 caracteres. Escreva o máximo de detalhes possível
                            </InputLabel>

                            <TextField
                                onChange={e => setNaoTestemunhasOcorrencia(e.target.value)}
                                rows={2}
                                multiline
                                type="text"
                                sx={{ width: '100%' }}
                                placeholder="Descreva aqui"
                            />
                        </Grid>
                    )
                else return <></>
            },
        },
        {
            name: 'IdGrauCerteza',
            label: 'Qual o grau de certeza sobre o fato que você está denunciando?',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                {
                    label: 'Já ouvi dizer',
                    value: '1',
                },
                {
                    label: 'Tenho a certeza',
                    value: '2',
                },
                {
                    label: 'Tenho suspeitas',
                    value: '3',
                },
            ],
        },
        {
            name: 'Evidencia',
            label: '',
            groupKey: 'infoRelate',
            ui: { grid: 12 },
            required: true,
            renderComponent(params) {
                return (
                    <Grid
                        item
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: backgroundColor,
                            border: `1px solid ${borderColor}`,
                            padding: '1rem',
                        }}
                    >
                        <Grid item xs={12}>
                            <InputLabel>
                                Caso você tenha evidências sobre o fato, faça o upload do arquivo aqui. Tamanho máximo:
                                10Mb
                            </InputLabel>
                        </Grid>
                        <TextField
                            type="file"
                            inputProps={{
                                multiple: true,
                            }}
                            onChange={e => {
                                const target = e.target as HTMLInputElement
                                const files = target.files as FileList
                                const filesArray: File[] = Array.from(files)
                                setArquivos(filesArray)
                            }}
                        />
                    </Grid>
                )
            },
        },
    ]

    if (loading) return <Loading />

    if (noCompany || !empresa?.Ativa) return <NoCompany />

    if (!termoAceito && !loading) {
        return (
            <>
                <Head>
                    <title>Termo de aceite</title>
                </Head>
                <AppBar logoUrl={empresa?.UrlLogo as string} />
                <TermosAceite
                    setTermAccepted={setTermAccepted}
                    companyName={empresa?.Nome ? empresa.Nome : ''}
                />
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Registro</title>
            </Head>
            <AppBar logoUrl={empresa?.UrlLogo as string} />
            <Grid container lg={7} xs={11} sx={{ margin: '2rem auto', padding: '4rem 0' }}>
                <Grid item xs={12} sx={{ mb: '3rem', textAlign: 'center' }}>
                    <Typography variant="h3" mb='1rem' color='#003768'>Envie sua denúncia</Typography>
                    <Divider />
                </Grid>
                <ApolloForm
                    schema={formSchema}
                    onSubmit={salvar}
                    initialValues={initialValues}
                    submitButtonText="Enviar"
                    groups={groups}
                    defaultExpandedGroup={true}
                />
            </Grid>
            <SuccessMessageModal
                protocol={protocol}
                open={openSuccesMessageModal}
                setOpen={setOpenSuccessMessageModal}
            />
        </>
    )
}
export default Form
