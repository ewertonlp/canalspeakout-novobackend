import { Button, Card, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { UsuarioController } from 'controllers/UsuarioController';
import { UserFiltersFormSchema } from 'formSchemas/userFormSchema';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import AccordionFilter from 'src/components/AccordionFilter';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Iconify from 'src/components/iconify/Iconify';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import CrudTable from 'src/sections/@dashboard/general/app/CrudTable';
import { Usuario } from 'types/Usuario';
import NewEditForm from './form/NewEditForm';
import NewUserTemp from './form/NewUserTemp';

// ----------------------------------------------------------------------

Usuarios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function Usuarios() {

    const { themeStretch } = useSettingsContext();

    const [filtros, setFiltros] = useState<Usuario>();

    const [loading, setLoading] = useState(false);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    
    const [openModalUser, setOpenModalUser] = useState(false);

    const [openModalTempUser, setOpenModalTempUser] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const listar = async () => {

        setLoading(true);

        try {

            const u = await new UsuarioController().Listar(filtros);

            if(u === null || u === undefined || u.length == 0){
                enqueueSnackbar('Nada encontrado na consulta',{ variant: 'warning' });
                return;
            }
            
            u.sort(function (a, b) {

                if (a.Nome < b.Nome) return -1;

                if (a.Nome > b.Nome) return 1;

                return 0;
            });

            setUsuarios(u);
        }

        catch (error) {
            enqueueSnackbar(error.error,{ variant: 'error' });
        }

        setLoading(false);
    }

    const inativar = async (u: any) => {
        
        try {

            console.log('inativar');
            console.log(u);

            await new UsuarioController().Inativar(Number(u.Id));
        } 
        catch (error) {
            enqueueSnackbar(error.error,{ variant: 'error' });
        }
    }

    useEffect(() => {listar()}, [filtros]);

    return (
        <>
            <Card sx={{ height: '100%', px: '1%', py: '18px' }}>
                <Head>
                    <title>Usuários</title>
                </Head>

                {loading && <LoadingScreen />}

                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <HeaderBreadcrumbs
                                heading={'Usuários'}
                                links={[
                                    {
                                        name: 'Usuários',
                                        href: '/usuarios',
                                    },
                                    { name: 'Lista' },
                                ]}

                                action={
                                    <Grid container spacing={2}>

                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                startIcon={<Iconify icon="material-symbols:add" />}
                                                onClick={() => {setOpenModalUser(true)}}
                                                sx={{ borderRadius: '25px', py: 1.5 }}>
                                                Cadastrar usuário
                                            </Button>
                                        </Grid>

                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Iconify icon="material-symbols:add" />}
                                                onClick={() => {setOpenModalTempUser(true)}}
                                                sx={{ borderRadius: '25px', py: 1.5 }}>
                                                Cadastrar usuário temporário
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            />
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <AccordionFilter
                                schemaForm={UserFiltersFormSchema}
                                setFilters={setFiltros}
                                formData={filtros}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CrudTable
                                tableData={usuarios}
                                setTableData={setUsuarios}
                                tableLabels={[
                                    { id: 'Nome', label: 'Nome' },
                                    { id: 'Email', label: 'E-mail' },
                                    { id: 'Cpf', label: 'CPF' },
                                    { id: 'action', label: 'Ações' },
                                ]}
                                removeFunction={inativar}
                                getItems={listar}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Card>

            <Dialog open={openModalUser} onClose={() => setOpenModalUser(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <Typography fontSize="1.5rem" fontWeight={600} >
                        Cadastrar Novo Usuário
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <NewEditForm />
                </DialogContent>
            </Dialog>

            <Dialog open={openModalTempUser} onClose={() => setOpenModalTempUser(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <Typography fontSize="1.5rem" fontWeight={600} >
                        Cadastrar Novo Usuário Temporário
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <NewUserTemp />
                </DialogContent>
            </Dialog>
        </>
    )
}
