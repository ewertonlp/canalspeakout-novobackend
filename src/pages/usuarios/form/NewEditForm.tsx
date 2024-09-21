import { Grid } from '@mui/material'
import { AreaController } from 'controllers/AreaController'
import { UsuarioController } from 'controllers/UsuarioController'
import { UserFormSchema } from 'formSchemas/userFormSchema'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { ApolloForm, ApolloFormSchemaItem } from 'src/components'
import { formError } from 'src/components/JsonForm'
import SelectWithCheckboxes from 'src/components/SelectWithCheckboxes'
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'
import { ISelectOption } from 'types/ISelectOption'
import { ISelectValue } from 'types/ISelectValue'

type UserNewEditForm = {
    values?: any
    customValues?: any
    editMode?: boolean
    areas?: string[]
}

const NewEditForm = ({ values, customValues, editMode, areas = [] }: UserNewEditForm) => {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()

    const [area, setSelectValue] = useState<string[]>(areas)
    const [selectOptions, setSelectOptions] = useState<ISelectValue[]>([])
    const [loading, setLoading] = useState(false)

    const formSchema: ApolloFormSchemaItem[] = [
        ...UserFormSchema,
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
        {
            name: 'Adm',
            label: 'Administrador',
            ui: { grid: 6 },

            // required: customValues.Comite === undefined || customValues.Comite == false,
            // hide: customValues.Comite !== undefined && customValues.Comite == true,

            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                { value: 'false', label: 'Não' },
                { value: 'true', label: 'Sim' },
            ],
        },
        {
            name: 'RecebeNotificacao',
            label: 'Recebe Notificações Gerais',
            ui: { grid: 6 },

            // hide: customValues.Comite !== undefined && customValues.Comite == true,
            // defaultValue: customValues.RecebeNotificacao !== undefined && customValues.RecebeNotificacao == true ? true : false,

            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                { value: 'false', label: 'Não' },
                { value: 'true', label: 'Sim' },
            ],
        },
        {
            name: 'RecebeNotificacaoRelato',
            label: 'Recebe Notificação de Relatos',
            ui: { grid: 6 },

            // hide: customValues.Comite !== undefined && customValues.Comite == true,
            // defaultValue: customValues.RecebeNotificacaoRelato !== undefined && customValues.RecebeNotificacaoRelato == true ? true : false,

            componenttype: ApolloFormSchemaComponentType.SELECT,
            options: [
                { value: 'false', label: 'Não' },
                { value: 'true', label: 'Sim' },
            ],
        },
        {
            name: 'Areas',
            required: false,
            label: 'Áreas de atuação',
            ui: { grid: 6 },
            renderComponent() {
                return (
                    <SelectWithCheckboxes
                        key={'Id'}
                        label="Áreas de atuação"
                        options={selectOptions}
                        value={area}
                        setValue={setSelectValue}
                        initialValue={areas}
                    />
                )
            },
        },
    ]

    const salvar = async data => {
        data = {
            ...data,
            areas: area,
        }

        setLoading(true)

        try {
            if (data.Id) {
                await new UsuarioController().Salvar(data)

                enqueueSnackbar('Usuário editado com sucesso!', { variant: 'success' })
            } else {
                delete data.Id

                if (data.Senha != data.SenhaConfirma) {
                    enqueueSnackbar('Ops! As senhas não coincidem', { variant: 'error' })
                    return
                }

                await new UsuarioController().Salvar(data)

                enqueueSnackbar('Cadastro realizado com sucesso! Um email de confirmação foi enviado para o usuário', {
                    variant: 'success',
                    autoHideDuration: null,
                })
            }
            router.push('/usuarios')
        } catch (error) {
            formError(error, enqueueSnackbar)
        }
        setLoading(false)
    }

    const listaArea = async () => {
        setLoading(true)

        try {
            const areas = await new AreaController().Listar()

            const selectOptions: ISelectOption[] = []

            areas.map(area => selectOptions.push({ label: area.Descricao, value: area.Id.toString()! }))

            setSelectOptions(selectOptions)
        } catch (error) {
            enqueueSnackbar('Erro ao recuperar áreas de atuação', {
                variant: 'error',
                autoHideDuration: null,
            })
        }

        setLoading(false)
    }

    useEffect(() => {
        listaArea()
    }, [])

    return (
        <Grid
            container
            sx={{
                minHeight: '50vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: '16px',
            }}
        >
            {loading && <LoadingScreen />}
            <ApolloForm
                schema={formSchema}
                initialValues={values}
                onSubmit={salvar}
                submitButtonText="Salvar"
                onCancel={() => router.push('/usuarios')}
                showCancelButtom={true}
                defaultExpandedGroup={true}
                customValues={customValues}
            />
        </Grid>
    )
}

export default NewEditForm
