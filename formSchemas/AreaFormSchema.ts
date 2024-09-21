import { ApolloFormSchemaItem } from 'src/components'
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component'

export const AreaFormSchema: ApolloFormSchemaItem[] = [
    {
        name: 'Id',
        required: false,
        label: 'id',        
        componenttype: ApolloFormSchemaComponentType.HIDDEN,
        ui: { grid: 12 },
    },
    {
        name: 'Descricao',
        required: true,
        label: 'Insira o nome da área de atuação que deseja cadastrar',
        componenttype: ApolloFormSchemaComponentType.TEXT,
        ui: { grid: 12 },
    }
]
