import { Box, Button, Container, Divider, Grid, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import { RelatoController } from 'controllers/RelatoController'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'
import Head from 'next/head'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import LoadingScreen from 'src/components/loading-screen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'
import BarChart from 'src/sections/@dashboard/general/analytics/BarChart'
import PizzaChart from 'src/sections/@dashboard/general/analytics/PizzaChart'
import { ChartData } from 'types/ChartData'
import { Empresa } from 'types/Empresa'

import { EmpresaController } from 'controllers/EmpresaController'
import { UsuarioController } from 'controllers/UsuarioController'
import 'styles/CustomChart.module.css'
import { Relato } from 'types/Relato'

// ----------------------------------------------------------------------

GeneralAnalyticsPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage() {
    const theme = useTheme()

    const { themeStretch } = useSettingsContext()
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [loading, setLoading] = useState(true)
    const { enqueueSnackbar } = useSnackbar()

    const [statusData, setStatusData] = useState({
        Novos: 0,
        'Em andamento': 0,
        'Finalizado procedente': 0,
        'Finalizado improcedente': 0,
    })

    const [relationWithCompanyData, setRelationWithCompanyData] = useState({
        colaborador: 0,
        'ex-colaborador': 0,
        cliente: 0,
        'fornecedor-prestador-credenciado': 0,
        comunidade: 0,
        especificar: 0,
    })

    const [typeOfComplaintData, setTypeOfComplaintData] = useState({
        Assédio: 0,
        Violência: 0,
        Discriminação: 0,
        Favorecimento: 0,
        'Subtração de bens ou dinheiro': 0,
        'Utilização indevida': 0,
        'Meio ambiente': 0,
        Falsificação: 0,
        Perigos: 0,
        Conduta: 0,
        Relações: 0,
        Outros: 0,
    })

    const [identifiedData, setIdentifiedData] = useState({
        identified: 0,
        notIdentified: 0,
    })

    const [thereWasAWitnessData, setThereWasAWitnessData] = useState({
        thereWas: 0,
        thereWasnt: 0,
    })

    const [totalPosts, setTotalPosts] = useState(0)

    const getData = async () => {
        setLoading(true)

        const us = new UsuarioController().InformacaoUsuarioLogado()

        //let contagemPorStatus = await new RelatoController().ContagemPorStatus();

        // let rels = await new RelatoController().ListarPorStatus(1,us.IdEmpresa);
        // let count = rels.length;

        // setStatusData(prev => ({ ...prev, Novos: count }))

        // rels = await new RelatoController().ListarPorStatus(2,us.IdEmpresa);
        // count = rels.length;

        // setStatusData(prev => ({ ...prev, 'Em andamento': count }))

        // rels = await new RelatoController().ListarPorStatus(3,us.IdEmpresa);
        // count = rels.length;

        // setStatusData(prev => ({ ...prev, 'Finalizado procedente': count }))

        // rels = await new RelatoController().ListarPorStatus(4,us.IdEmpresa);
        // count = rels.length;

        // setStatusData(prev => ({ ...prev, 'Finalizado improcedente': count }))

        setLoading(false)

        const relatos = await new RelatoController().ListarPorStatus(1, 0)

        //console.log(relatos);
        setTotalPosts(relatos.length)
        getRelationWithCompanyData(relatos)
        getTypeOfComplaintData(relatos)
        getIdentifiedData(relatos)
        getThereWasAWitnessData(relatos)
    }

    const [chartData, setChartData] = useState<ChartData>({
        statusData: {
            Novos: 0,
            'Em andamento': 0,
            'Finalizado procedente': 0,
            'Finalizado improcedente': 0,
        },
        relationWithCompanyData: {
            colaborador: 0,
            'ex-colaborador': 0,
            cliente: 0,
            'fornecedor-prestador-credenciado': 0,
            comunidade: 0,
            especificar: 0,
        },
        typeOfComplaintData: {
            Assédio: 0,
            Violência: 0,
            Discriminação: 0,
            Favorecimento: 0,
            'Subtração de bens ou dinheiro': 0,
            'Utilização indevida': 0,
            'Meio ambiente': 0,
            Falsificação: 0,
            Perigos: 0,
            Conduta: 0,
            Relações: 0,
            Outros: 0,
        },
        identifiedData: {
            identified: 0,
            notIdentified: 0,
        },
        thereWasAWitnessData: {
            thereWas: 0,
            thereWasnt: 0,
        },
    })

    const updateChartData = data => {
        setChartData(data)
    }

    useEffect(() => {
        getData()
        new EmpresaController().GetEmpresasAtivas()

        updateChartData(chartData)

        // const fetchDataAndLog = async () => {
        //     try {
        //         await fetchData();
        //     }
        //     catch (error) {
        //         console.error('Erro ao atualizar os dados:', error)
        //     }
        // }

        // fetchDataAndLog()
    }, [empresas])

    const getIdentifiedData = (relatos: Relato[]) => {
        const identifiedData = {
            identified: 0,
            notIdentified: 0,
        }

        relatos.map(r => {
            if (r.EmailDenunciante != '') {
                identifiedData.identified++
            } else {
                identifiedData.notIdentified++
            }
        })

        setIdentifiedData(identifiedData)
    }

    const getThereWasAWitnessData = (relatos: Relato[]) => {
        const thereWasAWitnessData = {
            thereWas: 0,
            thereWasnt: 0,
        }

        relatos.map(r => {
            if (r.Testemunhas != '') {
                thereWasAWitnessData.thereWas++
            } else {
                thereWasAWitnessData.thereWasnt++
            }
        })

        setThereWasAWitnessData(thereWasAWitnessData)
    }

    const getRelationWithCompanyData = (relatos: Relato[]) => {
        const relationWithCompanyData = {
            colaborador: 0,
            'ex-colaborador': 0,
            cliente: 0,
            'fornecedor-prestador-credenciado': 0,
            comunidade: 0,
            especificar: 0,
        }

        relatos.map(r => {
            relationWithCompanyData[r.RelacaoDenuncianteEmpresa]++
        })

        setRelationWithCompanyData(relationWithCompanyData)
    }

    const getTypeOfComplaintData = (relatos: Relato[]) => {
        const infracoes = {
            Assédio: 0,
            Violência: 0,
            Discriminação: 0,
            Favorecimento: 0,
            'Subtração de bens ou dinheiro': 0,
            'Utilização indevida': 0,
            'Meio ambiente': 0,
            Falsificação: 0,
            Perigos: 0,
            Conduta: 0,
            Relações: 0,
            Outros: 0,
        }

        relatos.map(r => {
            infracoes[r.Infracao]++
        })

        setTypeOfComplaintData(typeOfComplaintData)
    }

    async function exportGraficosParaPDF() {
        try {
            const doc = new jsPDF('l', 'px')
            const elements = document.getElementsByClassName('custom-chart')
            await creatPdf({ doc, elements })
            doc.save('graficos.pdf')
            enqueueSnackbar('PDF gerado com sucesso, verifique sua pasta de Downloads.', { variant: 'success' })
        } catch (error) {
            console.error('Ocorreu um erro ao exportar os gráficos para PDF:', error)
            enqueueSnackbar('Erro ao gerar PDF, tente novamente!', { variant: 'error' })
        }
    }

    async function creatPdf({ doc, elements }: { doc: jsPDF; elements: HTMLCollectionOf<Element> }) {
        let top = 32
        const padding = 16

        for (let i = 0; i < elements.length; i++) {
            const el = elements.item(i) as HTMLElement
            const imgData = await htmlToImage.toPng(el, { width: 1560, height: 1300 })

            let elHeight = el.offsetHeight
            let elWidth = el.offsetWidth

            const pageWidth = doc.internal.pageSize.getWidth()

            if (elWidth > pageWidth) {
                const ratio = pageWidth / elWidth
                elHeight = elHeight * ratio - padding
                elWidth = elWidth * ratio - padding
            }

            const pageHeight = doc.internal.pageSize.getHeight()

            if (top + elHeight > pageHeight) {
                doc.addPage()
                top = 16
            }

            doc.addImage(imgData, 'PNG', padding, top, elWidth, elHeight, `image${i}`)
            top += elHeight
        }
    }

    if (loading) return <LoadingScreen />

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'

    return (
        <>
            <Head>
                <title>Dashboard | Speakout</title>
            </Head>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid
                    item
                    xs={12}
                    // spacing={1}
                    //xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '2rem',
                        paddingBottom: '3rem',
                    }}
                >
                    <Typography variant="h4">Dashboard</Typography>
                    <Grid item>
                        <Link
                            href="/relatos"
                            sx={{
                                borderRadius: '30px',
                                color: '#fff',
                                backgroundColor: '#7EB353',
                                padding: '0.75rem 1.5rem',
                                transition: 'all 0.2s ease-out',
                                '&:hover': {
                                    backgroundColor: '#587D3A',
                                    textDecoration: 'none',
                                },
                            }}
                        >
                            Ir para os Relatos
                        </Link>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 5 }} />

                <div className="custom-chart">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box
                                sx={{
                                    transition: 'box-shadow 0.2s ease-out',
                                    borderRadius: '30px',
                                    backgroundColor: theme.palette.background.default,
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <PizzaChart
                                    title="Status"
                                    // ref={chartStatus}
                                    chart={{
                                        series: [
                                            { label: 'Novo', value: statusData.Novos },
                                            { label: 'Em andamento', value: statusData['Em andamento'] },
                                            {
                                                label: 'Finalizado procedente',
                                                value: statusData['Finalizado procedente'],
                                            },
                                            {
                                                label: 'Finalizado improcedente',
                                                value: statusData['Finalizado improcedente'],
                                            },
                                        ],
                                        colors: [
                                            theme.palette.primary.dark,
                                            theme.palette.info.dark,
                                            theme.palette.error.dark,
                                            theme.palette.warning.main,
                                        ],
                                    }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box
                                sx={{
                                    transition: 'box-shadow 0.2s ease-out',
                                    borderRadius: '30px',
                                    backgroundColor: theme.palette.background.default,
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <PizzaChart
                                    title="Denunciante se identificou"
                                    // ref={chartIdentificacao}
                                    chart={{
                                        series: [
                                            { label: 'Anônimo', value: identifiedData.notIdentified },
                                            { label: 'Identificado', value: identifiedData.identified },
                                        ],
                                        colors: [theme.palette.info.dark, theme.palette.warning.main],
                                    }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Box
                                sx={{
                                    transition: 'box-shadow 0.2s ease-out',
                                    borderRadius: '30px',
                                    backgroundColor: theme.palette.background.default,
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <PizzaChart
                                    title="Havia testemunhas"
                                    // ref={chartTestemunhas}
                                    chart={{
                                        series: [
                                            { label: 'Sim', value: thereWasAWitnessData.thereWas },
                                            { label: 'Não', value: thereWasAWitnessData.thereWasnt },
                                        ],
                                        colors: [theme.palette.info.dark, theme.palette.error.dark],
                                    }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                            <Box
                                sx={{
                                    transition: 'box-shadow 0.2s ease-out',
                                    borderRadius: '30px',
                                    backgroundColor: theme.palette.background.default,
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <BarChart
                                    title="Relação com a empresa"
                                    // ref={chartRelacaoEmpresa}
                                    chart={{
                                        series: [
                                            {
                                                label: 'Colaborador da empresa',
                                                value: relationWithCompanyData['colaborador'],
                                            },
                                            {
                                                label: 'Ex-colaborador da empresa',
                                                value: relationWithCompanyData['ex-colaborador'],
                                            },
                                            { label: 'Cliente da empresa', value: relationWithCompanyData['cliente'] },
                                            {
                                                label: 'Fornecedor / Prestador / Credenciado da empresa',
                                                value: relationWithCompanyData['fornecedor-prestador-credenciado'],
                                            },
                                            {
                                                label: 'Comunidade no entorno da empresa',
                                                value: relationWithCompanyData['comunidade'],
                                            },
                                            { label: 'Outros', value: relationWithCompanyData['especificar'] },
                                        ],
                                        colors: [
                                            theme.palette.info.dark,
                                            theme.palette.info.dark,
                                            theme.palette.info.dark,
                                            theme.palette.info.dark,
                                            theme.palette.info.dark,
                                            theme.palette.info.dark,
                                        ],
                                    }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Box
                                sx={{
                                    transition: 'box-shadow 0.2s ease-out',
                                    borderRadius: '30px',
                                    backgroundColor: theme.palette.background.default,
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <BarChart
                                    title="Tipos de denúncia"
                                    // ref={chartTipoDenuncia}
                                    chart={{
                                        series: [
                                            {
                                                label: 'Assédio',
                                                value: typeOfComplaintData['Assédio'],
                                            },
                                            {
                                                label: 'Conduta',
                                                value: typeOfComplaintData['Conduta'],
                                            },
                                            {
                                                label: 'Discriminação',
                                                value: typeOfComplaintData['Discriminação'],
                                            },
                                            {
                                                label: 'Falsificação',
                                                value: typeOfComplaintData['Falsificação'],
                                            },
                                            {
                                                label: 'Favorecimento',
                                                value: typeOfComplaintData['Favorecimento'],
                                            },
                                            {
                                                label: 'Meio ambiente',
                                                value: typeOfComplaintData['Meio ambiente'],
                                            },
                                            {
                                                label: 'Assédio',
                                                value: typeOfComplaintData['Perigos'],
                                            },
                                            {
                                                label: 'Falsificação',
                                                value: typeOfComplaintData['Falsificação'],
                                            },
                                            {
                                                label: 'Violência',
                                                value: typeOfComplaintData['Violência'],
                                            },
                                            {
                                                label: 'Utilização indevida',
                                                value: typeOfComplaintData['Utilização indevida'],
                                            },
                                            {
                                                label: 'Relações com a comunidade ou setor público',
                                                value: typeOfComplaintData['Relações'],
                                            },
                                            {
                                                label: 'Outros',
                                                value: typeOfComplaintData['Outros'],
                                            },
                                        ],
                                        colors: [
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                            theme.palette.error.main,
                                        ],
                                    }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${borderColor}`,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </div>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        my: 5,
                        backgroundColor: 'card.default',
                        padding: '2rem',
                        borderRadius: '15px',
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <Grid item>
                        <Typography sx={{ color: `${theme.palette.text.secondary}`, fontSize: '1.2rem' }}>
                            Total de relatos:{' '}
                            <span style={{ color: `${theme.palette.text.primary}` }}>{totalPosts}</span>
                        </Typography>
                    </Grid>
                    <Grid>
                        <>
                            <Button
                                onClick={exportGraficosParaPDF}
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: '30px', padding: '0.5rem 1rem' }}
                            >
                                Exportar para PDF
                            </Button>
                        </>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
// function fetchData() {
//     throw new Error('Function not implemented.');
// }
