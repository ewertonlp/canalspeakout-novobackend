import { Grid } from '@mui/material';
import { AreaController } from 'controllers/AreaController';
import { AreaFormSchema } from 'formSchemas/AreaFormSchema';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { ApolloForm } from 'src/components';
import { formError } from 'src/components/JsonForm';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { Area } from 'types/Area';

type UserNewEditForm = {
    values?: any
    customValues?: any
}

const NewEditForm = ({ values, customValues }: UserNewEditForm) => {

    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [openModal, setOpenModal] = useState(true)

    const onSubmit = async a => {
        
        setLoading(true);

        a = {
            ...a
        }

        try {
            
            let msg = a.Id ? 'Área editada com sucesso!' : 'Cadastro realizado com sucesso!';

                let area = new Area;
                area.Id = String(a.Id) != '' ? parseInt(a.Id) : 0;
                area.Descricao = a.Descricao;

                await new AreaController().Salvar(area);

                enqueueSnackbar(msg, { variant: 'success' });
           
            router.push('/areasdeatuacao');
        }

        catch (error) {
            formError(error, enqueueSnackbar);
        }
        
        setLoading(false);
    }

    const [loading, setLoading] = useState(false)

    return (
        <Grid sx={{display: 'flex', justifyContent:'center', }}>
            {loading && <LoadingScreen />}
            <ApolloForm
                schema={AreaFormSchema}
                initialValues={values}
                onSubmit={onSubmit}
                submitButtonText="Salvar"
                onCancel={() => router.push('/areasdeatuacao')}
                showCancelButtom={true}
                defaultExpandedGroup={true}
                customValues={customValues}
            />
        </Grid>
    )
}

export default NewEditForm
