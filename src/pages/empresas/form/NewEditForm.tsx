import { Grid, InputLabel, TextField } from '@mui/material'
import { EmpresaController } from 'controllers/EmpresaController'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { ApolloForm } from 'src/components'
import { ApolloFormSchemaComponentType, ApolloFormSchemaItem } from 'src/components/apollo-form/ApolloForm.component'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'

type EmpresaForm = {
    values?: any
    customValues?: any
    currentLogoId?: string
    currentBannerId?: string
}

const NewEditForm = ({ values, customValues, currentBannerId, currentLogoId }: EmpresaForm) => {

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [logoFile, setArquivoLogo] = useState<File>();
    const [bannerFile, setArquivoBanner] = useState<File>();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(true) ;

    async function salvar(empresa: any) {

        setLoading(true);

        try {
            
            let emp = await new EmpresaController().Salvar(empresa);

            enqueueSnackbar('Empresa salva com sucesso', { variant: 'success' });

            if(logoFile) {
                await new EmpresaController().Upload(logoFile,emp.Id,'logo');
            }

            if(bannerFile) {
                await new EmpresaController().Upload(bannerFile,emp.Id,'banner');
            }

            router.push('/empresas');
        } 
        catch (error) 
        {
            enqueueSnackbar(`Erro ao cadastrar empresa: ${error.error}`, { variant: 'error' });
        }

        setLoading(false);
    }

    const EmpresaSchema: ApolloFormSchemaItem[] = [
        {
            name: 'Id',
            required: false,
            label: 'Id',
            ui: { grid: 12 },
            componenttype: ApolloFormSchemaComponentType.HIDDEN,
        },
        {
            name: 'Nome',
            required: true,
            label: 'Nome',
            componenttype: ApolloFormSchemaComponentType.TEXT,
            ui: { grid: 12 },
        },
        
        {
            name: 'RazaoSocial',
            required: true,
            label: 'Razão Social',
            componenttype: ApolloFormSchemaComponentType.TEXT,
            ui: { grid: 12 },
        },
        {
            name: 'Cnpj',
            required: true,
            label: 'CNPJ',
            componenttype: ApolloFormSchemaComponentType.TEXT,
            ui: { grid: 6 },
        },
        {
            name: 'Ativa',
            required: true,
            label: 'Situação',
            componenttype: ApolloFormSchemaComponentType.SELECT,
            ui: { grid: 6 },
            options: [
                { label: 'Ativa', value: 'true' },
                { label: 'Inativa', value: 'false' },
            ],
        },
        {
            name: 'UrlCodigoConduta',
            required: true,
            label: 'Link para o código de conduta',
            componenttype: ApolloFormSchemaComponentType.TEXT,
            ui: { grid: 12 },
        },
       
        {
            name: 'Descricao',
            required: true,
            label: 'Descrição',
            componenttype: ApolloFormSchemaComponentType.TEXTAREA,
            ui: { grid: 20 },
        },
       
        {
            name: 'UrlLogo',
            label: 'Logo',
            ui: { grid: 6 },
            required: true,
            renderComponent(params) {
                return (
                    <Grid item>
                        <Grid item xs={12}>
                            <InputLabel>Selecione um arquivo para a logo *</InputLabel>
                        </Grid>
                        <TextField
                            type="file"
                            onChange={e => {
                                const target = e.target as HTMLInputElement
                                const files = target.files as FileList
                                setArquivoLogo(files[0])
                            }}
                        />
                    </Grid>
                )
            },
        },
        {
            name: 'UrlBanner',
            label: 'Banner',
            ui: { grid: 6 },
            required: true,
            renderComponent(params) {
                return (
                    <Grid item>
                        <Grid item xs={12}>
                            <InputLabel>Selecione um arquivo para o banner *</InputLabel>
                        </Grid>
                        <TextField
                            type="file"
                            onChange={e => {
                                const target = e.target as HTMLInputElement
                                const files = target.files as FileList
                                setArquivoBanner(files[0])
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
            <ApolloForm
                schema={EmpresaSchema}
                initialValues={values}
                onSubmit={salvar}
                showCancelButtom={true}
                onCancel={() => setOpenModal(false)}
                submitButtonText="Cadastrar"
                defaultExpandedGroup={true}
                isEdit
                customValues={customValues}
            />
        </>
    )
}

export default NewEditForm
