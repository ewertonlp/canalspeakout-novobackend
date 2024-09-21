import { ApolloFormSchemaItem } from 'src/components'
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component'

export const UserTempFormSchema: ApolloFormSchemaItem[] = [
    {
        name: 'Id',
        required: false,
        label: 'Id',
        componenttype: ApolloFormSchemaComponentType.HIDDEN,
        ui: { grid: 12 },
    },

    {
        name: 'Nome',
        required: true,
        label: 'Nome Completo',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 6 },
    },
    {
        name: 'Email',
        required: true,
        label: 'E-Mail',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 12 },
    },
]

export const UserFiltersFormSchema: ApolloFormSchemaItem[] = [
    {
        name: 'Nome',
        required: false,
        label: 'Nome',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 4 },
    },
    {
        name: 'Email',
        required: false,
        label: 'E-Mail',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 4 },
    },
]
