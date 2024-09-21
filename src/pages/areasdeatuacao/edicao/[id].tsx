// next
import Head from 'next/head'
// @mui
import { Container, Divider, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AreaController } from 'controllers/AreaController'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { ApolloFormSchemaCustomValues } from 'src/components'
import CustomCard from 'src/components/CustomCard'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import LoadingScreen from 'src/components/loading-screen/LoadingScreen'
import { useSettingsContext } from 'src/components/settings'
import DashboardLayout from 'src/layouts/dashboard'
import { Area } from 'types/Area'
import NewEditForm from '../form/NewEditForm'

// ----------------------------------------------------------------------

Edicao.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------
export default function Edicao() {
    const { themeStretch } = useSettingsContext()
    const { query } = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()
    const [initialValues, setInitialValues] = useState<Area>()
    const [openModal, setOpenModal] = useState(false)
    const theme = useTheme()

    const [customValues, setCustomValues] = useState<ApolloFormSchemaCustomValues[]>()

    const loadData = async id => {

        setLoading(true);

        const area = await new AreaController().BuscarPorId(id);

        if (!area) {
            enqueueSnackbar('Falha ao carregar dados da área de atuação', { variant: 'error', autoHideDuration: null });
            return;
        }

        setCustomValues([
            { name: 'Id', value: area.Id! },
            { name: 'Descricao', value: area.Descricao },
        ]);

        setLoading(false);
    }

    useEffect(() => {
        if (query.id && Number(query.id)) {
            loadData(query.id)
        }
    }, [query.id]);

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'

    return (
        <CustomCard>
            <Head>
                <title>Editar área de atuação</title>
            </Head>
            {loading && <LoadingScreen />}
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid item xs={12}>
                    <HeaderBreadcrumbs
                        heading={'Áreas de atuação'}
                        links={[
                            {
                                name: 'Áreas de atuação',
                                href: '/areasdeatuacao',
                            },
                            { name: 'Edição' },
                        ]}
                    />
                </Grid>
                <Divider />
                <Grid
                    xs={6}
                    sx={{
                        maxWidth: '800px',
                        margin: '10rem auto',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '10px',
                        padding: '4rem 2rem',
                        backgroundColor: 'card.default',
                        transition: 'all 0.2s ease-out',
                        '&:hover': {
                            boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
                        },
                    }}
                >
                    <NewEditForm />
                </Grid>
            </Container>
        </CustomCard>
    )
}
