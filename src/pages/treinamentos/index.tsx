import { Box, Card, Container, Divider, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TreinamentoEmpresaController } from 'controllers/TreinamentoEmpresaController'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { useAuthContext } from 'src/auth/useAuthContext'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/iconify/Iconify'
import LoadingScreen from 'src/components/loading-screen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'
import { TreinamentoEmpresa } from 'types/TreinamentoEmpresa'
//

const Treinamentos = () => {
    const { themeStretch } = useSettingsContext()
    const { idEmpresa } = useAuthContext()
    const [trainingData, setTrainingData] = useState<TreinamentoEmpresa[]>([])
    const [status, setStatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const theme = useTheme()

    const getTreinamento = async () => {
        try {
            setLoading(true)
            let treinamentos = await new TreinamentoEmpresaController().Listar();
            setTrainingData(treinamentos);
            setStatus(treinamentos[0].Liberado);
        } 
        catch (error) {
            console.error(`Não foi possivel carregar os treinamentos: ${error}`, error)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!idEmpresa)return;
        getTreinamento();
    }, [idEmpresa])

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'

    return (
        <>
            <Card sx={{ height: '100%', px: '1%', py: '15px' }}>
                <Head>
                    <title>Treinamentos</title>
                </Head>
                <HeaderBreadcrumbs
                    heading={'Área de Treinamentos'}
                    links={[
                        {
                            name: 'Área de treinamento',
                            href: '/treinamentos',
                        },
                        { name: 'Lista' },
                    ]}
                />
                <Divider />
                {loading && <LoadingScreen />}
                <Container sx={{ marginTop: '20px' }} maxWidth={themeStretch ? false : 'xl'}>
                    <Grid rowGap={{ xs: '15px', lg: '25px' }}>
                        <Grid item xs={12} sm={6} md={4} lg={6} xl={4}>
                            <Card sx={{}}>
                                <Box sx={{ width: '100%' }}>
                                    {/* <Tabs value={value} onChange={handleChange} sx={{ marginBottom: '16px' }}>
                                        <Tab label="Documentos" style={{ fontSize: '1.15rem' }} />
                                        <Tab label="Vídeos" style={{ fontSize: '1.15rem' }} />
                                    </Tabs>
                                    <Divider /> */}

                                    {/* {value === 1 && (
                                        <Box sx={{ minWidth: 300, marginTop: 6, marginBottom: 4 }}>
                                            <p style={{ fontSize: '1.2rem' }}>Assédio Moral e Sexual</p>
                                            {videos.map((video, index) => (
                                                <ReactPlayer key={index} url={video.url} controls />
                                            ))}
                                        </Box>
                                    )} */}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                            gap: 5,
                                            marginTop: 8,
                                            marginBottom: 4,
                                            padding: 2,
                                            backgroundColor: 'card.default',
                                            borderRadius: '10px',
                                            border: `1px solid ${borderColor}`,
                                        }}
                                    >
                                        {loading ? (
                                            <p>Carregando...</p>
                                        ) : status === undefined ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap',
                                                    backgroundColor: '#FFF5CC',
                                                    padding: '2rem',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <Iconify
                                                    icon="eva:alert-triangle-fill"
                                                    style={{ color: 'orange', width: '3rem', fontSize: '2rem' }}
                                                />
                                                <p
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Entre em contato com a <strong> Equipe Speakout </strong> para
                                                    adquirir os treinamentos necessários.
                                                </p>
                                            </div>
                                        ) : (
                                            trainingData.map((item, index) => (
                                                <Grid
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        JustifyContent: 'center',
                                                        padding: '1rem',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <ReactPlayer
                                                        url={item.Url}
                                                        controls={false}
                                                        config={{
                                                            youtube: {
                                                                playerVars: { fs: 0 },
                                                            },
                                                        }}
                                                    />
                                                    <p style={{ fontSize: '1.2rem' }}>{item.Treinamento}</p>
                                                </Grid>
                                            ))
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Card>
        </>
    )
}

Treinamentos.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default Treinamentos
