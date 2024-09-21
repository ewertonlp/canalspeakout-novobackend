import { Button, Card, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AreaController } from 'controllers/AreaController';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import BarChart from 'src/sections/@dashboard/general/analytics/BarChart';
import CrudTable from 'src/sections/@dashboard/general/app/CrudTable';
import { Area } from 'types/Area';
import NewEditForm from './form/NewEditForm';

// ----------------------------------------------------------------------

Areas.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function Areas() {

    const { themeStretch } = useSettingsContext();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const theme = useTheme();
    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2';

    const getAreas = async () => {
        
        try {

            setLoading(true);
            
            const areas = await new AreaController().Listar();

            setAreas(areas);
            
            setLoading(false)
        }
        
        catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {getAreas();}, []);

    return (
        <>
            <Card sx={{ height: '100%', px: '1%', py: '18px' }}>
                <Head>
                    <title>Áreas de atuação</title>
                </Head>
                {loading && <LoadingScreen />}
                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <HeaderBreadcrumbs
                                heading={'Área de atuação'}
                                links={[
                                    {
                                        name: 'Área de atuação',
                                        href: '/areasdeatuacao',
                                    },
                                    { name: 'Lista' },
                                ]}
                                action={
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                sx={{ borderRadius: '25px', px: 4, py: 1.5 }}
                                                startIcon={<Iconify icon="material-symbols:add" />}
                                                onClick={() => {
                                                    setOpenModal(true)
                                                }}
                                            >
                                                Adicionar área
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            />
                            <Divider />
                        </Grid>

                        <Grid item xs={5}>
                            <CrudTable
                                tableData={areas}
                                setTableData={setAreas}
                                tableLabels={[
                                    { id: 'Descricao', label: 'Área de Atuação' },
                                    { id: 'action', label: 'Ações' },
                                ]}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        
                        <Grid item xs={5}>
                            <Grid
                                sx={{
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: 'card.default',
                                    borderRadius: '10px',
                                    padding: '2rem',
                                    '&:hover': {
                                        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                    },
                                }}
                            >
                                <div>
                                    <BarChart
                                        title="Relatos por departamento"
                                        chart={{
                                            series: [],
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
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Card>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} sx={{ height: '100vh', py: '3rem' }}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <Typography fontSize="1.5rem" fontWeight={600} color="text">
                        Cadastrar Área (Departamento)
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '2rem' }}>
                    <NewEditForm />
                </DialogContent>
            </Dialog>
        </>
    )
}
