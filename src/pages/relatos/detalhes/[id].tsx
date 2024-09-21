import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RelatoAcaoController } from 'controllers/RelatoAcaoController';
import { RelatoArquivoController } from 'controllers/RelatoArquivoController';
import { RelatoController } from 'controllers/RelatoController';
import { RelatoHistoricoController } from 'controllers/RelatoHistoricoController';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ActionsPage from 'src/components/ActionsPage';
import { ConclusionPage } from 'src/components/ConclusionPage';
import ReportDetails from 'src/components/ReportDetails';
import ReportHistory from 'src/components/ReportHistory';
import ReportMenu from 'src/components/ReportMenu';
import { UserList } from 'src/components/UserList/UserList';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
// import styled from 'styled-components';
import { Relato } from 'types/Relato';
import { RelatoAcao } from 'types/RelatoAcao';
import { RelatoArquivo } from 'types/RelatoArquivo';
import { RelatoHistorico } from 'types/RelatoHistorico';
import { Usuario } from 'types/Usuario';

// ----------------------------------------------------------------------

Detalhes.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------
export default function Detalhes() {

    const { themeStretch } = useSettingsContext();
    const { query, back } = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const titleColor = theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.secondary;
    const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
    const [page, setPage] = useState<'relato' | 'historico' | 'usuarios' | 'conclusao' | 'acoes'>('relato');
    const [fileUploaded, setFileUploaded] = useState(false);

    const [relato, setRelato] = useState<Relato>();

    const [historicos, setHistoricos] = useState<RelatoHistorico[]>([]);

    const [arquivos, setArquivos] = useState<RelatoArquivo[]>([]);

    const [acoes, setAcoes] = useState<RelatoAcao[]>([]);

    const buscarRelato = async id => {

        setLoading(true);

        try {
            const r = await new RelatoController().BuscarPorId(Number(id));

            // setRelato(relato);
            setRelato(r);

            const h = await new RelatoHistoricoController().ListarPorRelato(r.Id);

            console.log('historicos');
            console.log(h);

            if(h && h.length > 0) setHistoricos(h);

            const a = await new RelatoAcaoController().ListarPorRelato(r.Id);

            console.log('acoes');
            console.log(a);

            if(a && a.length > 0) setAcoes(a);

            const arq = await new RelatoArquivoController().ListarPorRelato(r.Id);

            if(arq && arq.length > 0) setArquivos(arq);
        } 

        catch (e) {
            console.log(e);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (query.id && Number(query.id) > 0) {
            buscarRelato(query.id);
        }
    }, [query.id, fileUploaded]);

    if (loading) return <LoadingScreen />

    return (
        <>
            {relato && (
                <>
                    <Head>
                        <title>Detalhes do relato</title>
                    </Head>
                    <Grid display="flex" my={3} mx={2} alignItems="center">
                        <BackButtonWrapper onClick={() => back()}>
                            <ArrowBackIosNewOutlinedIcon
                                sx={{
                                    fontSize: '30px',
                                    color: '#727272',
                                    '&:hover': {
                                        color: '#7EB353',
                                        transition: 'color 0.3s',
                                    },
                                }}
                            />
                        </BackButtonWrapper>
                        <Typography
                            className="button-icon"
                            sx={{
                                marginLeft: '10px',
                            }}
                            variant="h5"
                        >
                            {relato.Protocolo} {relato.Status}
                        </Typography>
                    </Grid>
                    <Container maxWidth={themeStretch ? false : 'xl'}>
                        <ReportMenu page={page} setPage={setPage} />

                        {page === 'relato' ? (
                            <ReportDetails post={relato} setPost={setRelato}/>
                            // <ReportDetails post={relato} setPost={setRelato} uploadedFiles={arquivos} />
                        ) : page === 'historico' ? (
                            <ReportHistory histories={historicos} getPost={buscarRelato} />
                        ) : page === 'usuarios' ? (
                            <UserList
                                postId={String(relato.Id)}
                                selectedUsers={selectedUsers}
                                setSelectedUsers={setSelectedUsers}
                            />
                        ) : page === 'acoes' ? (
                            <ActionsPage relato={relato} getRelato={buscarRelato} />
                        ) : (
                            <ConclusionPage historico={historicos} idRelato={relato.Id}/>
                        )}
                    </Container>
                </>
            )}
        </>
    )
}

const BackButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`
