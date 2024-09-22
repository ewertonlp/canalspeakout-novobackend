import { Alert, AlertColor, Dialog, DialogContent, DialogTitle, Grid, InputLabel, Snackbar, TextField } from '@mui/material';
import { RelatoAcaoController } from 'controllers/RelatoAcaoController';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ApolloForm, { ApolloFormSchemaComponentType, ApolloFormSchemaItem, } from 'src/components/apollo-form/ApolloForm.component';
import { RelatoAcao } from 'types/RelatoAcao';
import { RelatoUsuario } from 'types/RelatoUsuario';
import LoadingScreen from '../loading-screen/LoadingScreen';

export function NewActionModal({open,setOpen,usuarios}: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    usuarios: RelatoUsuario[]
}) {

    const handleClose = () => setOpen(false);

    const [fileFieldValue, setFileFieldValue] = useState<File[]>();

    const { query } = useRouter();

    const [initialValue, setInitialValue] = useState([]);

    // const userOptions: { label: string; value: string; email: string }[] = [];
    const [userOptions, setUserOptions] = useState<{ label: string; value: string; email: string }[]>([]);

    usuarios.map(u => userOptions.push({ value: String(u.IdUsuario), label: u.Usuario, email: u.Email }));

    console.log(usuarios);

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    const [snackbarMessage, setSnackbarMessage] = useState<{ type: AlertColor; text: string }>({
        type: 'error',
        text: '',
    });

    function handleCloseSnackbar() {
        setOpenSnackbar(false);
    }

    function showSnackbarMessage(type: AlertColor, text: string) {
        setOpenSnackbar(true);
        setSnackbarMessage({ type, text });
    }

    const [loading, setLoading] = useState(false);


    async function salvar(data: any) {

        setLoading(true);

        try {

            let ra = new RelatoAcao();

            ra.IdRelato = Number(query.id);
            console.log('Dados enviados para a API:', data);

            ra = await new RelatoAcaoController().Salvar(data,fileFieldValue as File[]);

            showSnackbarMessage('success', 'Operação realizada com sucesso.');
        }

        catch (error) {
            showSnackbarMessage('error', 'Falha ao fazer upload de mídia')
            console.log(error)
        }

        setLoading(false);
    }

    useEffect(() => {
        if (usuarios && usuarios.length > 0) {
            const options = usuarios.map(u => ({
                value: String(u.IdUsuario),
                label: u.Usuario,
                email: u.Email,
            }));
            setUserOptions(options);  
        }
    }, [usuarios]); 
    

    const formSchema: ApolloFormSchemaItem[] = [
        {
            name: 'Titulo',
            label: 'Título',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.TEXT,
        },
        {
            name: 'Descricao',
            label: 'Insira a descrição',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.TEXTAREA,
        },
        {
            name: 'IdUsuario',
            label: 'Selecione o usuário responsável pela ação',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: userOptions,
        },
        {
            name: 'Status',
            label: 'Status',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                { value: '1', label: 'Ativa' },
                { value: '2', label: 'Inativa' },
                { value: '3', label: 'Encerrada' },
            ],
        },
        {
            name: 'file',
            label: '',
            ui: { grid: 12 },
            required: false,
            renderComponent(params) {
                return (
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <InputLabel sx={{ml:'1rem'}}>Selecione o arquivo</InputLabel>
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

    return (
        <>
            {loading && <LoadingScreen />}
            <Dialog open={open} onClose={handleClose} sx={{borderRadius:'10px'}}>
                <DialogTitle sx={{ textAlign:'center' }} textTransform='capitalize' color="text" id="scroll-dialog-title">
                    Cadastrar nova ação
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
                            initialValues={initialValue}
                            submitButtonText="Enviar"
                            onSubmit={salvar}
                            showCancelButtom
                            onCancel={handleClose}
                            cancelButtonTitle="Fechar"
                            defaultExpandedGroup={true}
                        />
                        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                            <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.type} sx={{ width: '100%' }}>
                                {snackbarMessage.text}
                            </Alert>
                        </Snackbar>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}
