import { ApolloFormSchemaItem } from 'src/components';
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component';

export const UserFormSchema: ApolloFormSchemaItem[] = [
    {
        name: 'Id',
        required: false,
        label: 'id',
        componenttype: ApolloFormSchemaComponentType.HIDDEN,
        ui: { grid: 12 },
    },
    {
        name: 'Nome',
        required: true,
        label: 'Nome',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 6 },
    },
    {
        name: 'Cpf',
        required: true,
        label: 'CPF',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        mask: '999.999.999-99',
        ui: { grid: 6 },
    },
    {
        name: 'Email',
        required: true,
        label: 'Email',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 6 },
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
        label: 'E-mail',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 4 },
    },
    {
        name: 'Cpf',
        required: false,
        label: 'CPF',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 4 },
    },
]
