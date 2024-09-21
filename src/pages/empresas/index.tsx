import { Button, Card, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { EmpresaController } from 'controllers/EmpresaController';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import CrudTable from 'src/sections/@dashboard/general/app/CrudTable';
import { Empresa } from 'types/Empresa';
import NewEditForm from './form/NewEditForm';

// ----------------------------------------------------------------------

Empresas.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function Empresas() {

    const { themeStretch } = useSettingsContext();
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [openModal, setOpenModal] = useState(false) ;
    const { enqueueSnackbar } = useSnackbar();

    const getEmpresas = () => {

        setLoading(true);

        try {
            const empresas = new EmpresaController().GetEmpresasAtivas();
            
            empresas.forEach(emp => (emp.UrlRelato = `https://${location.host}/ouvidoria/${emp.Cnpj}`));
            
            setEmpresas(empresas);
        }

        catch (error) {
            enqueueSnackbar(error.error, { variant: 'error', autoHideDuration: 3000 });
            console.log(error);
        }

        setLoading(false);
    }

    const inativaEmpresa = async (id: string) => {
        try {
            let emp = new Empresa();

            emp.Id = parseInt(id);

            await new EmpresaController().Inativar(emp);
        } 
        catch (error) {
            console.log(error);
            enqueueSnackbar(error.error, { variant: 'error', autoHideDuration: 3000 });
        }
    }

    useEffect(() => {getEmpresas() }, []);

    return (
        <>
            {loading && <LoadingScreen />}
            <Card sx={{ height: '100%', px: '1%', py: '18px' }}>
                <Head>
                    <title>Empresas | Canal Speakout</title>
                </Head>

                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <HeaderBreadcrumbs
                                heading={'Empresas'}
                                links={[
                                    {
                                        name: 'Empresas',
                                        href: '/empresas',
                                    },
                                    { name: 'Lista' },
                                ]}
                                action={
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                sx={{borderRadius: '25px', px: 4, py: 1.5}}
                                                startIcon={<Iconify icon="material-symbols:add" />}
                                                onClick={() => {
                                                    setOpenModal(true)
                                                }}
                                            >
                                                Adicionar empresa
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            />
                            <Divider/>
                        </Grid>

                        <Grid item xs={12}>
                            <CrudTable
                                tableData={empresas}
                                setTableData={setEmpresas}
                                tableLabels={[
                                    { id: 'Nome', label: 'Nome' },
                                    { id: 'Ativa', label: 'Situação' },
                                    { id: 'UrlRelato', label: 'Link relato', link: true },
                                    { id: 'action', label: 'Ações' },
                                ]}
                                getItems={getEmpresas}
                                onDelete={inativaEmpresa}
                                sx={{width: '100%', color: '#1D1D1E'}}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Card>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} sx={{height:'100vh', py: '5rem'}}>
                <DialogTitle sx={{textAlign:"center"}} >
                    <Typography fontSize='1.5rem' fontWeight={600} color="gray">Cadastrar Nova Empresa</Typography>
                </DialogTitle>
                <DialogContent sx={{paddingBottom: '2rem'}}>
                    <NewEditForm /> 
                </DialogContent>
            </Dialog>
        </>
    )
}
