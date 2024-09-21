import { AttachFile, CheckCircle, GetApp } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
    Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton,
    List, ListItem, ListItemIcon, ListItemText, TextField, Tooltip, Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { RelatoArquivoController } from 'controllers/RelatoArquivoController';
import { RelatoController } from 'controllers/RelatoController';
import { RelatoHistoricoController } from 'controllers/RelatoHistoricoController';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { RelatoArquivo } from 'types/RelatoArquivo';
import ComplaintHistoryCard from '../ouvidoria/ComplaintHistoryCard';

const StyledCard = styled(Card)({
    margin: '2rem auto',
    padding: '1rem',
});

const FileList = styled(List)({
    width: '100%',
    backgroundColor: 'background.default',
});

const FileIcon = styled(AttachFile)({
    fontSize: '2rem',
});

const CenteredBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const ButtonDownloadPDF = styled(Button)({
    marginTop: '1rem',
});

export const ConclusionPage = ({ historico, idRelato}) => {

    const [usuarioLogado] = useState(
        historico && historico[0] && historico[0].user ? historico[0].UsuarioCad: { Nome: 'Nome de usuário' },
    );
    
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isReportFinalized, setIsReportFinalized] = useState(false);
    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const theme = useTheme();

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2';

    const [arquivosRelato, setArquivosRelato] = useState<RelatoArquivo[]>([]);
    const [arquivos, setArquivos] = useState([]);

    const { query } = useRouter();

    const { usuario } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();

    const fetchPostClosedFiles = async () => {

        const relato = await new RelatoController().BuscarPorId(idRelato);

        const relatos = Array.isArray(relato) ? relato : [relato];

        const allFilesPromises = relatos.map(postClosed => {

            if (relato && relatos) {
                return Promise.all(relatos.map(a => new RelatoArquivoController().BuscarPorId(a.Id)));
            }

            return Promise.resolve<RelatoArquivo[]>([]);
        });

        const allFilesArrays = await Promise.all(allFilesPromises);

        const allFiles = ([] as RelatoArquivo[]).concat(...allFilesArrays);

        setArquivosRelato(allFiles);
    }

    const fetchPostClosedComments = async () => {

        setLoadingComments(true) ;

        try {

            const relato = await new RelatoController().BuscarPorId(idRelato);

            if (relato) {

                const relatos = Array.isArray(relato) ? relato : [relato];

                if (relatos[0]) {
                    setIsReportFinalized(!!relatos[0].Fechado);

                    if (relatos[0].DataFechamento) {
                        await gerarPDF();
                    }
                }
            }
        } 
        catch (error) {
            console.error('Erro ao buscar os comentários:', error);
        }

        setLoadingComments(false)
    }

    const fetchAndStoreFiles = async () => {
        await fetchPostClosedFiles();
    };

    useEffect(() => {

        fetchPostClosedFiles();
        fetchPostClosedComments();
        fetchAndStoreFiles();

        setTimeout(() => {setLoadingComments(false);}, 2000);

    }, [idRelato]);

    const downloadFile = async (file: RelatoArquivo) => {
        setDownloadingFile(String(file.Id));

        const link = document.createElement('a');

        link.href = file.Url;

        if (
            file.Nome.endsWith('.png') ||
            file.Nome.endsWith('.jpeg') ||
            file.Nome.endsWith('svg') ||
            file.Nome.endsWith('.pdf') ||
            file.Nome.endsWith('.jpg')
        ) {
            link.target = '_blank';
        } 
        else {
            link.download = file.Nome;
        }

        link.click();
        setDownloadingFile(null);
    }

    async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {

        const arquivo = event.target.files ? event.target.files[0] : null;

        if (arquivo) {
            setArquivoSelecionado(arquivo);
            const newUploadedFiles = [...uploadedFiles];
            newUploadedFiles.push(arquivo.name);
            setUploadedFiles(newUploadedFiles);
        }
    }
   
    const handleFinalizeReport = async () => {

        setIsLoading(true);

        if (message.trim() == '') return;

        const fecharRelato = async () => {

            try {

                await new RelatoController().Fechar(Number(String(query.id)));

                await gerarPDF();
            } 

            catch (error) {
                console.error('Erro ao finalizar relato: ', error);
            }

            setIsLoading(false);
            setIsReportFinalized(true);
            fetchPostClosedFiles();
        }

        if (arquivoSelecionado) {

            setIsUploading(true);

            try {

                let arqs: File[] = [];
                arqs.push(arquivoSelecionado);

                const resp = await new RelatoArquivoController().Salvar(arqs,Number(query.id));
                const mediaId = resp[0].id
                setArquivoSelecionado(null);
                fecharRelato();
            }

            catch (error) {
                console.error('Erro ao fazer upload do arquivo:', error);
            }
            setIsUploading(false);
        }

        else {
            fecharRelato();
        }
    }

    async function gerarPDF(){

        try {

            let r = await new RelatoController().BuscarPorId(Number(query.id));
    
            const doc = new jsPDF();
    
            let y = 195;
    
            doc.text('Relatório de Denúncia', 105, 20, { align: 'center' });
            doc.setFontSize(12);
    
            doc.text('Informações Gerais', 20, 40);
            doc.text(`ID: ${r.Id}`, 20, 50);
            doc.text(`Protocolo: ${r.Protocolo}`, 20, 55);
            doc.text(`Email: ${r.EmailDenunciante}`, 20, 60);
            doc.text(`Status: ${r.Status}`, 20, 65);
            doc.text(`Sensibilidade: ${r.Sensibilidade}`, 20, 70);
            doc.text(`Criado em: ${r.DataCad}`, 20, 75);
            doc.text(`Atualizado em: ${r.DataAlt}`, 20, 80);
            doc.text('Detalhes do Denunciante', 20, 90);
            doc.text(`Nome: ${r.NomeDenunciante}`, 20, 95);
            doc.text(`Cargo: ${r.CargoDenunciante}`, 20, 100);
            doc.text(`Email: ${r.EmailDenunciante}`, 20, 105);
            doc.text(`Empresa: ${r.Empresa}`, 20, 110);
            doc.text(`Relação: ${r.RelacaoDenuncianteEmpresa}`, 20, 115);
            doc.text(`Infração: ${r.Infracao}`, 20, 120);
            doc.text(`Telefone: ${r.TelefoneDenunciante}`, 20, 125);
            doc.text(`Evidência: ${r.Evidencia}`, 20, 130);
            doc.text(`Área de Atuação: ${r.AreaDenunciante}`, 20, 135);
            doc.text(`Identificação: ${r.Identificado ? 'Sim' : 'Não'}`, 20, 140);
            doc.text(`Tipo de denúncia: ${r.InfracaoEspecifica}`, 20, 145);
            doc.text(
                `Data da ocorrência: ${format(new Date(r.DataInfracao), 'dd/MM/yyyy')}`,
                20,
                150,
            );
            doc.text(`Horário para contato: ${r.HorarioContato}`, 20, 155);
            doc.text(`Autor da ocorrência: ${r.NomeInfrator}`, 20, 160);
            doc.text(`Local da ocorrência: ${r.LocalInfracao}`, 20, 165);
            doc.text(`Recorrência da ocorrência: ${r.Recorrencia}`, 20, 170);
            doc.text(`Testemunhas da ocorrência: ${r.Testemunhas}`, 20, 175);
            doc.text(`Grau de certeza da denuncia: ${r.GrauCerteza}`, 20, 180);
            doc.text('Conclusão', 20, 190);
    
            let hs = await new RelatoHistoricoController().ListarPorRelato(r.Id);
    
            hs.forEach((h) => {
                doc.text(`Criado em: ${format(new Date(h.DataCad), 'dd/MM/yyyy')}`, 20, y);
                y += 5;
                doc.text(`Mensagem: ${h.Comentario}`, 20, y);
                y += 5;
                doc.text(`Atualizado: ${format(new Date(h.DataAlt), 'dd/MM/yyyy')}`, 20, y);
                y += 10;
            });
    
            const url = URL.createObjectURL(doc.output('blob'));
            setReportUrl(url);
        }
        
        catch (error) {
            console.error('Erro ao criar URL do PDF:', error);
        }
    }

    async function excluiHistorico(id){

        setIsLoading(true);

        try {
            await new RelatoHistoricoController().Excluir(id);
            enqueueSnackbar('Comentário excluído com sucesso', { variant: 'success', autoHideDuration: 3000 });
        } 
        
        catch (error) {
            enqueueSnackbar('Erro ao excluir comentário', { variant: 'error', autoHideDuration: 3000 });
        } 
        
        finally {
            setIsLoading(false);
            setDeleteModalOpen(false);
        }
    }

    return (
        <>
            <StyledCard>
                <CardContent>
                    <Grid container display="flex" justifyContent="center" gap={5} spacing={3} mb="4rem">
                        <Grid
                            item
                            xs={7}
                            sx={{
                                backgroundColor: 'card.default',
                                borderRadius: '10px',
                                border: `1px solid ${borderColor}`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '0 1rem 0 1rem',
                                transition: 'all 0.2s ease-out',
                                '&:hover': {
                                    boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                },
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                sx={{ padding: '1rem 0.5rem 2rem' }}
                            >
                                <Typography variant="h5">Comentários</Typography>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={2}
                                >
                                    {usuario?.Adm && (
                                        <>
                                            <label htmlFor="raised-button-file">
                                                <Button variant="outlined" component="span">
                                                    <AttachFile /> Anexar Arquivo
                                                </Button>
                                            </label>
                                            <input
                                                style={{ display: 'none' }}
                                                id="raised-button-file"
                                                type="file"
                                                onChange={handleFileSelection}
                                            />
                                        </>
                                    )}
                                    <span style={{ fontSize: '0.8rem'}}>Máximo de 5MB por arquivo.</span>
                                    {arquivoSelecionado && <Typography variant="body1">{arquivoSelecionado.name}</Typography>}
                                </Box>
                            </Box>

                            <Grid item xs={12}>
                                <TextField
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Todas as observações de conclusão do Relato devem ser inseridas neste campo."
                                    multiline
                                    rows={4}
                                    fullWidth
                                    sx={{
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: '6px',
                                        backgroundColor: 'background.default',
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} paddingY="2rem">
                                <LoadingButton
                                    loading={isLoading}
                                    loadingPosition="start"
                                    startIcon={<CheckCircle />}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFinalizeReport}
                                    fullWidth
                                    disabled={message.trim() === ''}
                                >
                                    Finalizar Relato
                                </LoadingButton>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sx={{
                                    borderTop: `1px solid ${borderColor}`,
                                    mt: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '1rem 0.5rem 2rem',
                                }}
                            >
                                <Typography variant="h5" mt="1rem">
                                    Histórico de comentários
                                </Typography>
                                <Grid item xs={12} px="1rem" mt="1rem">
                                    {loadingComments ? (
                                        <CenteredBox>
                                            <Typography sx={{ marginY: '1rem', marginRight: '1rem' }} variant="body1">
                                                Carregando comentários...
                                            </Typography>
                                            <CircularProgress size={32} color="primary" />
                                        </CenteredBox>
                                    ) : (
                                        historico.map((h, index) => (
                                            <Box
                                                key={index}
                                                marginBottom={3}
                                                display="flex"
                                                alignItems="end"
                                                justifyContent="space-between"
                                                width="100%"
                                            >
                                                <Box flexGrow={1} flexBasis="auto">
                                                    <ComplaintHistoryCard
                                                        date={h.DataCad}
                                                        name={h.UsuarioCad ? h.UsuarioCad : 'Desconhecido'}
                                                        comment={h.Comentario}
                                                        lightShadow
                                                        biggerPadding
                                                    />
                                                </Box>

                                                <Tooltip title="Excluir comentário">
                                                    <IconButton
                                                        aria-label="excluir comentario"
                                                        onClick={()=> excluiHistorico(h.Id)}
                                                        sx={{
                                                            '&:hover': {
                                                                color: '#FF5630',
                                                                background: 'transparent',
                                                            },
                                                        }}
                                                    >
                                                        {usuario?.Adm && <DeleteIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        ))
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid
                            item
                            xs={4}
                            sx={{
                                backgroundColor: 'card.default',
                                borderRadius: '10px',
                                border: `1px solid ${borderColor}`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                padding: '0 1rem 0 1rem',
                                transition: 'all 0.2s ease-out',
                                '&:hover': {
                                    boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                                },
                            }}
                        >
                            <Grid>
                                {arquivosRelato.length > 0 && (
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            backgroundColor: 'card.default',
                                            borderBottom: `1px solid ${borderColor}`,
                                            padding: '1rem 1rem 2rem',
                                        }}
                                    >
                                        <Typography sx={{ marginY: '10px' }} variant="h6">
                                            Arquivos anexados
                                        </Typography>
                                        <FileList>
                                            {arquivosRelato.map(a => (
                                                <Fragment key={a.Id}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <FileIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={a.Nome} />
                                                        <IconButton
                                                            onClick={() => downloadFile(a)}
                                                            color="primary"
                                                            aria-label="download file"
                                                        >
                                                            <GetApp />
                                                        </IconButton>
                                                    </ListItem>
                                                    <Divider />
                                                </Fragment>
                                            ))}
                                        </FileList>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid>
                                {isReportFinalized && reportUrl && (
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            backgroundColor: 'card.default',
                                            borderBottom: `1px solid ${borderColor}`,
                                            padding: '0 0 0 1rem',
                                        }}
                                    >
                                        <Typography sx={{ marginTop: '2.5rem', marginBottom: '1rem' }} variant="h6">
                                            Relato concluído
                                        </Typography>
                                        <ButtonDownloadPDF
                                            variant="contained"
                                            color="primary"
                                            className=""
                                            sx={{
                                                width: '100%',
                                                paddingY: '0.5rem',
                                                textAlign: 'center',
                                                marginBottom: '1rem',
                                                position: 'relative',
                                            }}
                                            onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = reportUrl
                                                link.download = 'relato.pdf'
                                                link.click()
                                                enqueueSnackbar('Download concluído, verifique sua pasta Downloads', {
                                                    variant: 'success',
                                                    autoHideDuration: 3000,
                                                })
                                            }}
                                        >
                                            Download do relatório
                                        </ButtonDownloadPDF>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </StyledCard>

            <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle textAlign={'center'}>Confirmar Exclusão</DialogTitle>
                <DialogContent>Tem certeza que deseja excluir o comentário?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} size="large">
                        Cancelar
                    </Button>
                    <Button onClick={excluiHistorico} color="error" size="large">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
