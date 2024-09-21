import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RelatoHistoricoController } from 'controllers/RelatoHistoricoController';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Loading from 'src/components/Loading';
import AppBar from 'src/components/ouvidoria/AppBar';
import { HistoryofOccurencesModal } from 'src/components/ouvidoria/HistoryOfOccurencesModal';
import NoCompany from 'src/components/ouvidoria/NoCompany';
import { Empresa } from 'types/Empresa';
import { RelatoHistorico } from 'types/RelatoHistorico';

function StatusDenunciaPage() {

    const [protocolo, setProtocolo] = useState('');
    const router = useRouter();
    const cnpj = router.query.company;
    const [empresa, setInfoEmpresa] = useState<Empresa>();
    const [noCompany, setNoCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [carregarRelatos, setRelatos] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [historico, setHistorico] = useState<RelatoHistorico[]>();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'

    useEffect(() => {

        if (!router.isReady) return;

        const getInfo = async () => {

            setLoading(true);

            if (String(cnpj).length && String(cnpj).length == 18) {

                let emp = new Empresa();
                let s = String(sessionStorage.getItem('idEmpresa'));
                emp.Id = Number(s);
                setInfoEmpresa(emp);
                setNoCompany(false);
                setLoading(false);
            } 

            else {

                enqueueSnackbar('Empresa não encontrada!', { variant: 'error' });
                setNoCompany(true);
                setLoading(false);
                return;
            }
        }
        
        getInfo();
    }, [router.isReady])

    async function consultar() {

        setRelatos(true);

        if(protocolo === null || protocolo === undefined || protocolo.length < 1){

            enqueueSnackbar('Informe o protocolo.', {variant: 'warning'});

            setRelatos(false);

            return;
        }

        const resp = await new RelatoHistoricoController().ListarPorProtocolo(protocolo);

        if(resp && resp !== null && resp !== undefined && resp.length){
            setHistorico(resp);
            setOpenModal(true);
            setRelatos(false);
        }

        else{
            enqueueSnackbar('Protocolo não encontrado.', {variant: 'info'});
            setRelatos(false);
        }
    }

    if (loading) return <Loading />

    if (noCompany || !empresa?.Ativa) return <NoCompany />

    return (
        <>
            <Head>
                <title>Status da denúncia</title>
            </Head>

            <AppBar logoUrl={empresa?.UrlLogo as string} />
            <Grid container display="flex" alignItems="center" height="calc(100% - 84px)" justifyContent="center">
                <Grid item xs={10} lg={5}>
                    <Card
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
                        <Grid
                            p={3}
                            sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', rowGap: '35px' }}
                        >
                            <Typography variant="h3">Acompanhar relato</Typography>
                            <Typography variant="body1">
                                Insira o número de protocolo, recebido por email, no campo abaixo para verificar o
                                status do relato ou enviar novas evidências para o comitê. Através do número de
                                protocolo é possível acompanhar todo o processo de tratamento do seu relato.
                            </Typography>
                            <TextField
                                label="Qual o número de protocolo do seu relato?"
                                onChange={e => setProtocolo(e.target.value)}
                                required
                                placeholder=""
                                type="text"
                                id="outlined-basic"
                                fullWidth
                                autoComplete={'false'}
                                sx={{
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '15px',
                                    backgroundColor: '#d6d6d6',
                                }}
                            />
                            <Grid display="flex" flexDirection="row" gap="10px" justifyContent="center">
                                <Button
                                    variant="outlined"
                                    onClick={() => router.back()}
                                    sx={{ width: '150px', borderRadius: '30px' }}
                                >
                                    Voltar
                                </Button>
                                <LoadingButton
                                    loading={carregarRelatos}
                                    variant="contained"
                                    onClick={consultar}
                                    sx={{ width: '150px', borderRadius: '30px' }}
                                >
                                    Consultar
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {historico && (
                <HistoryofOccurencesModal historico={historico} open={openModal} setOpen={setOpenModal} />
            )}
        </>
    )
}

export default StatusDenunciaPage
