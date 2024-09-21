import { Alert, AlertColor, Button, Container, Dialog, DialogContent, DialogTitle, Grid, InputLabel, Snackbar, TextField, Typography, } from '@mui/material';
import { RelatoAcaoController } from 'controllers/RelatoAcaoController';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApolloForm, ApolloFormSchemaItem } from 'src/components';
import BackButton from 'src/components/BackButton';
import CustomCard from 'src/components/CustomCard';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import { RelatoAcao } from 'types/RelatoAcao';

EditAction.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

export default function EditAction() {
    const router = useRouter()

    const { themeStretch } = useSettingsContext()
    const { query } = useRouter()

    const idRelato = query.post;
    const idRelatoAcao = query.id;

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<{ type: AlertColor; text: string }>({
        type: 'error',
        text: '',
    })

    function handleCloseSnackbar() {
        setOpenSnackbar(false)
    }

    function showSnackbarMessage(type: AlertColor, text: string) {
        setOpenSnackbar(true);
        setSnackbarMessage({ type, text });
    }
    const [loading, setLoading] = useState(false);

    const [arquivos, setFileFieldValue] = useState<File[]>();

    const [ra, setPostAction] = useState<RelatoAcao>();

    // const handleDelete = (id: string) => {
    //     if (ra) {
    //         const postActionsDetails = ra.filter(details => details.id !== id)
    //         setPostAction({ ...postAction, postactionsdetails: postActionsDetails })
    //     }
    // }

    const [openModal, setOpenModal] = useState(false);

    const fecharModal = () => {setOpenModal(false)}

    const loadData = async id => {

        setLoading(true);

        try {
            
            const ra = await new RelatoAcaoController().ListarPorRelato(id);
            setPostAction(ra[0]);
        } 
        catch (e) {

        }
        setLoading(false);
    }

    useEffect(() => {
        if (idRelato && Number(idRelatoAcao)) loadData(idRelatoAcao);

    }, [idRelatoAcao])

    const formSchema: ApolloFormSchemaItem[] = [
        {
            name: 'Titulo',
            required: true,
            label: 'Título',
            componenttype: ApolloFormSchemaComponentType.TEXT,
            ui: { grid: 12 },
        },
        {
            name: 'Descricao',
            required: true,
            label: 'Descrição',
            componenttype: ApolloFormSchemaComponentType.TEXTAREA,
            ui: { grid: 12 },
        },
        {
            name: 'file',
            label: '',
            ui: { grid: 12 },
            required: false,
            renderComponent(params) {
                return (
                    <Grid item>
                        <Grid item xs={12}>
                            <InputLabel>Selecione os arquivos</InputLabel>
                        </Grid>
                        <TextField
                            type="file"
                            inputProps={{
                                multiple: true,
                            }}
                            onChange={e => {
                                const target = e.target as HTMLInputElement
                                const files = target.files as FileList
                                const filesArray: File[] = Array.from(files)
                                setFileFieldValue(filesArray)
                            }}
                        />
                    </Grid>
                )
            },
        },
    ]

    const salvar = async ra => {

        try {
            let r = new RelatoAcao();

            r.Id = Number(idRelatoAcao !== undefined && idRelatoAcao !== null ? idRelatoAcao : 0);
            r.IdRelato = Number(idRelato as string);
            r.Descricao = ra.Descricao;
            r.Titulo =  ra.Titulo;
            
            const f = arquivos !== undefined && arquivos !== null && arquivos.length > 0 ? arquivos : [];

            await new RelatoAcaoController().Salvar(r,f);

            showSnackbarMessage('success', 'Ação cadastrada com sucesso');

            loadData(idRelatoAcao);
        } 
        catch (e) {
            showSnackbarMessage('error', `Falha ao cadastrar ação: ${e.error}`);
        }
            
        fecharModal();
    }

    return (
        <CustomCard>
            <Head>
                <title>Edição de ação</title>
            </Head>
            {loading && <LoadingScreen />}
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <BackButton />
                <Grid item xs={12}>
                    <HeaderBreadcrumbs heading={'Edição de ação'} links={[{ name: 'Edição' }]} />
                </Grid>
                <Grid display="flex" justifyContent="space-between" mb="20px">
                    <Typography variant="body1">
                        <strong>Status: </strong>

                        {ra?.IdStatus == 1 ? 'Ativa' : (ra?.IdStatus == 0 ? 'Inativa' : 'Encerrada')}

                    </Typography>
                    <Typography variant="body1">
                        <strong>Usuário responsável: </strong>
                        {ra?.IdUsuarioCad ? ra.IdUsuarioCad : 'Desconhecido'}
                        
                    </Typography>
                </Grid>
                <Grid display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="secondary" onClick={() => setOpenModal(true)}>
                        Novo comentário
                    </Button>
                </Grid>

                <Grid display="flex" rowGap="20px" flexDirection="column" mt="20px">
                    {/* {(postAction?.postactionsdetails &&
                        postAction?.postactionsdetails.length > 0 &&
                        postAction?.postactionsdetails.map((comment, index) => (
                            <ActionCommentCard
                                date={comment.createdAt}
                                description={comment.description}
                                title={comment.title}
                                name={comment.user ? comment.user.fullname : 'Desconhecido'}
                                key={index}
                                handleDelete={() => handleDelete(comment.id)}
                            />
                        ))) || (
                        <Grid height="400px" display="flex" alignItems="center" justifyContent="center">
                            <Typography variant="body1" textAlign={'center'} fontWeight={600}>
                                Ainda não há comentários para exibir
                            </Typography>
                        </Grid>
                    )} */}
                </Grid>
                <Dialog open={openModal} onClose={fecharModal}>
                    <DialogTitle sx={{ padding: '20px 18px 5px 18px' }} color="#727272" id="scroll-dialog-title">
                        Cadastrar novo comentário
                    </DialogTitle>
                    <DialogContent sx={{ padding: '0' }}>
                        <Grid
                            display="flex"
                            flexDirection="column"
                            p={2}
                            item
                            lg={8}
                            xs={12}
                            margin="0 auto"
                            minHeight={'auto'}
                            sx={{ minWidth: { xs: '100%', md: '500px' } }}
                        >
                            <ApolloForm
                                schema={formSchema}
                                initialValues={{}}
                                onSubmit={salvar}
                                submitButtonText="Salvar"
                                onCancel={() => router.back()}
                                showCancelButtom={true}
                                defaultExpandedGroup={true}
                            />
                            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                                <Alert
                                    onClose={handleCloseSnackbar}
                                    severity={snackbarMessage.type}
                                    sx={{ width: '100%' }}
                                >
                                    {snackbarMessage.text}
                                </Alert>
                            </Snackbar>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Container>
        </CustomCard>
    )
}
