import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid } from '@mui/material';
import { UsuarioController } from 'controllers/UsuarioController';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import CrudTable from 'src/sections/@dashboard/general/app/CrudTable';
import { Relato } from 'types/Relato';
import { RelatoController } from '../../../controllers/RelatoController';

// ----------------------------------------------------------------------

ReportsListing.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------

export default function ReportsListing() {
    const { themeStretch } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const [idRelatoExcluido, setIdRelatoExcluido] = useState('0');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState('-1');
    const [loading, setLoading] = useState(false);
    const [relatos, setRelatos] = useState<Relato[]>([]);
    const [activeButton, setActiveButton] = useState('-1');

    const listaRelatos = async (status) => {

        const u = new UsuarioController().GetUsuarioLogado();

        if(u === undefined || u === null || u.IdEmpresa <= 0) return;

        setLoading(true);

        try {

            if(status == 'am'){
                setRelatos(await new RelatoController().ListarAbertosPorEmpresaNoMesAtual(u.IdEmpresa));
            }

            else if(status === null || status == '' ||  status == '-1'){
                setRelatos(await new RelatoController().ListarPorEmpresa(u.IdEmpresa));
            }

            else {
                setRelatos(await new RelatoController().ListarPorStatus(Number(status),u.IdEmpresa));
            }
        }

        catch (e) {
            enqueueSnackbar(`Erro ao carregar relatos : ${e.error}`, { variant: 'error' });
        }

        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        
        if(!relatos || relatos.length == 0){

            const fetchData = async () => {
                await listaRelatos('-1');
                setStatusSelecionado('-1');
                setActiveButton('-1');
            };

            fetchData();
        }
    }, [statusSelecionado]);

    const confirmaExclusao = id => {
        setIdRelatoExcluido(id);
        setDeleteModalOpen(true);
    }

    const excluir = async () => {
        if (idRelatoExcluido) {

            try {
                await new RelatoController().Excluir(Number(idRelatoExcluido));
                enqueueSnackbar('Relato excluído com sucesso', { variant: 'success' });
                await listaRelatoPorStatus(statusSelecionado);
            } 
            
            catch (e) {
                enqueueSnackbar(`Erro ao excluir o relato: ${e.error}`, { variant: 'error' });
            }

            setDeleteModalOpen(false);
            setIdRelatoExcluido('0');
        }
    }

    const listaRelatoPorStatus = (status: string) => {
        setStatusSelecionado(status);
        setActiveButton(status);
        listaRelatos(status);
    }

    return (
        <>
            <Head>
                <title>Relatos | Speakout</title>
            </Head>
            {loading && <LoadingScreen />}
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <HeaderBreadcrumbs
                            heading={'Relatos'}
                            links={[
                                {
                                    name: 'Relatos',
                                    href: '/relatos',
                                },
                                { name: 'Lista' },
                            ]}
                        />
                        <Divider />
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <Button
                            variant={statusSelecionado === '-1' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('-1')}
                        >
                            Todos
                        </Button>

                        <Button
                            variant={statusSelecionado === 'am' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('am')}
                        >
                            Abertos no mês
                        </Button>

                        <Button
                            variant={statusSelecionado === '0' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('0')}
                        >
                            Novos
                        </Button>

                        <Button
                            variant={statusSelecionado === '1' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('1')}
                        >
                            Em andamento
                        </Button>

                        <Button
                            variant={statusSelecionado === '2' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('2')}
                        >
                            Finalizado procedente
                        </Button>

                        <Button
                            variant={statusSelecionado === '3' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('3')}
                        >
                            Finalizado improcedente
                        </Button>

                        <Button
                            variant={statusSelecionado === '4' ? 'contained' : 'outlined'}
                            sx={{ mx: '0.5rem', borderRadius: '25px', px: '25px', py: '10px' }}
                            onClick={() => listaRelatoPorStatus('4')}
                        >
                            Cancelados
                        </Button>
                    </Grid>

                    <Grid item xs={12} sx={{}}>
                        <CrudTable
                            editPagePath="/detalhes/"
                            tableData={relatos || []}
                            setTableData={setRelatos}
                            clickableRow
                            onDelete={confirmaExclusao}
                            sx={{ boxShadow: '1px 1px 15px rgba(1,0,0,0.16)' }}
                            tableLabels={[
                                { id: 'EmailDenunciante', label: 'Email' },
                                { id: 'DataCadPtBr', label: 'Data Criação' },
                                { id: 'Status', label: 'Status' },
                                { id: 'TipoDenuncia', label: 'Tipo de denúncia' },
                                { id: 'DiasEmAberto', label: 'Dias em aberto' },
                                { id: 'DataFechamentoPtBr', label: 'Data Fechamento' },
                                { id: 'Sensibilidade', label: 'Sensibilidade' },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle textAlign={'center'}>Confirmar Exclusão</DialogTitle>
                <DialogContent>Tem certeza que deseja excluir este relato ?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} size="large">
                        Cancelar
                    </Button>
                    <Button onClick={excluir} color="error" size="large">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
