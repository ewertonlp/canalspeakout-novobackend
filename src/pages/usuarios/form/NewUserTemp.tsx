import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { UsuarioController } from 'controllers/UsuarioController'
import { UserTempFormSchema } from 'formSchemas/userTempFormSchema'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { ApolloForm, ApolloFormSchemaItem } from 'src/components'
import { formError } from 'src/components/JsonForm'
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'

type UserNewEditForm = {
    values?: any
    customValues?: any
    editMode?: boolean
}

const NewUserTemp = ({ values, customValues, editMode }: UserNewEditForm) => {
    const router = useRouter()
    const theme = useTheme()
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)

    const backgroundColor =
        theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.default

    const formSchema: ApolloFormSchemaItem[] = [
        ...UserTempFormSchema,
        {
            name: 'Senha',
            required: !editMode ? true : false,
            label: 'Senha',
            componenttype: editMode ? ApolloFormSchemaComponentType.HIDDEN : ApolloFormSchemaComponentType.PASSWORD,
            ui: { grid: 6 },
        },
        {
            name: 'SenhaConfirma',
            required: !editMode ? true : false,
            label: 'Confirmar senha',
            componenttype: editMode ? ApolloFormSchemaComponentType.HIDDEN : ApolloFormSchemaComponentType.PASSWORD,
            ui: { grid: 6 },
        },
    ]

    const salvar = async data => {
        data = {
            ...data,
        }

        console.log('uTemp')
        console.log(data)

        setLoading(true)

        try {
            if (data.Senha != data.SenhaConfirma) {
                enqueueSnackbar('Ops! As senhas não coincidem', { variant: 'error' })
                return
            }

            data.Comite = true

            await new UsuarioController().Salvar(data)

            enqueueSnackbar(
                !data.Id || Number(data.Id) == 0
                    ? 'Cadastro realizado com sucesso! Um email de confirmação foi enviado para o usuário'
                    : 'Cadastro atualizado com sucesso! Um email de confirmação foi enviado para o usuário',
                {
                    variant: 'success',
                    autoHideDuration: null,
                },
            )

            router.push('/usuarios')
        } catch (error) {
            formError(error.error, enqueueSnackbar)
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <Grid
            container
            sx={{
                minHeight: '50vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: '10px',
                backgroundColor: backgroundColor,
            }}
        >
            {loading && <LoadingScreen />}
            <ApolloForm
                schema={formSchema}
                initialValues={values}
                onSubmit={salvar}
                submitButtonText="Cadastrar"
                onCancel={() => router.push('/usuarios')}
                showCancelButtom={true}
                defaultExpandedGroup={true}
                customValues={customValues}
            />
        </Grid>
    )
}

export default NewUserTemp
