import { ArticleOutlined, CalendarMonth } from '@mui/icons-material'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import InboxIcon from '@mui/icons-material/Inbox'
import { Card, CardContent, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { RelatoController } from 'controllers/RelatoController'
import { UsuarioController } from 'controllers/UsuarioController'
import Head from 'next/head'
import Link from 'next/link'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import LoadingScreen from 'src/components/loading-screen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'

const reportData = [
    { title: 'Total de relatos', Icon: InboxIcon, status: 'Total de relatos' },
    { title: 'Relatos abertos no mês atual', Icon: CalendarMonth, status: 'Relatos abertos no mês atual' },
    { title: 'Novos', Icon: ArticleOutlined, status: 'Novos' },
    { title: 'Em andamento', Icon: HourglassEmptyIcon, status: 'Em andamento' },
    { title: 'Finalizado procedente', Icon: DoneIcon, status: 'Finalizado procedente' },
    { title: 'Finalizado improcedente', Icon: CancelIcon, status: 'Finalizado improcedente' },
]

const Relatorios = ({ data = reportData }) => {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const [loading, setLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState('')
    const theme = useTheme()
  
    const [reportNumbers, setReportNumbers] = useState({
        'Total de relatos': '-',
        'Relatos abertos no mês atual': '-',
        Novos: '-',
        'Em andamento': '-',
        'Finalizado procedente': '-',
        'Finalizado improcedente': '-',
    })

    const getData = async () => {

        setLoading(true);

        const relato = new RelatoController();

        try {
            const idEmp = new UsuarioController().InformacaoUsuarioLogado().IdEmpresa;

            const totalGeral = await relato.TotalGeral(idEmp);

            setReportNumbers(prev => ({ ...prev, 'Total de relatos': totalGeral.toString() }));

            const abertosNoMesAtual = await relato.TotalEmAbertoNoMesAtual(idEmp);
            setReportNumbers(prev => ({ ...prev, 'Relatos abertos no mês atual': abertosNoMesAtual.toString() }));

            const novos = await relato.TotalPorStatus(0,idEmp);
            setReportNumbers(prev => ({ ...prev, Novos: novos.toString() }));

            const emAndamento = await relato.TotalPorStatus(1,idEmp);
            setReportNumbers(prev => ({ ...prev, 'Em andamento': emAndamento.toString() }));

            const finalizadoProcedente = await relato.TotalPorStatus(2,idEmp);
            setReportNumbers(prev => ({ ...prev, 'Finalizado procedente': finalizadoProcedente.toString() }));

            const finalizadoImprocedente = await relato.TotalPorStatus(3,idEmp);
            setReportNumbers(prev => ({ ...prev, 'Finalizado improcedente': finalizadoImprocedente.toString() }));
        } 
        catch (e) {
            enqueueSnackbar(`Erro ao recuperar dados do relatório: ${e.error}`, { autoHideDuration: 5000 });
        }
        setLoading(false);
    }

    useEffect(() => {
        setSelectedStatus('')
        getData()
    }, [])

    const selecionaStatus = status => {
        setSelectedStatus(status);
    }

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'
    const backgroundColor = theme.palette.mode === 'dark' ? 'card.default' : 'card.default'

    return (
        <>
            <Head>
                <title>Relatórios</title>
            </Head>
            <Typography variant="h4" sx={{ margin: '25px' }}>
                Relatórios
            </Typography>
            {loading && <LoadingScreen />}
            <Container sx={{ marginTop: '40px' }} maxWidth={themeStretch ? false : 'xl'}>
                <Grid
                    container
                    display="flex"
                    justifyContent="space-around"
                    rowGap={{ xs: '15px', lg: '25px' }}
                    spacing={2}
                >
                    {data.map((report, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={6} xl={4} key={index}>
                            <Link href={`/relatos?status=${report.status.trim()}`}>
                                <div onClick={() => selecionaStatus(report.status)}>
                                    {selectedStatus === '' || selectedStatus === report.title ? (
                                        <Card
                                            sx={{
                                                minWidth: 275,
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                cursor: 'pointer',
                                                border: `1px solid ${borderColor}`,
                                                backgroundColor: backgroundColor,
                                            }}
                                        >
                                            <report.Icon
                                                style={{
                                                    fontSize: 40,
                                                    marginTop: '20px',
                                                    marginBottom: '-16px',
                                                    color: '#7eb353',
                                                }}
                                            />
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography
                                                    sx={{ marginBottom: '16px', color: 'gray' }}
                                                    variant="h5"
                                                    component="div"
                                                >
                                                    {report.title}
                                                </Typography>
                                                <Typography sx={{ fontSize: '24px', color: '#7eb353' }} variant="body2">
                                                    {reportNumbers[report.title]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ) : null}
                                </div>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

Relatorios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default Relatorios
