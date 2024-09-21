import { Container, Grid } from '@mui/material';
import { UsuarioController } from 'controllers/UsuarioController';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { ApolloFormSchemaCustomValues } from 'src/components';
import CustomCard from 'src/components/CustomCard';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/components/settings';
import DashboardLayout from 'src/layouts/dashboard';
import NewEditForm from '../form/NewEditForm';

// ----------------------------------------------------------------------

Edicao.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>

// ----------------------------------------------------------------------
export default function Edicao() {

    const { themeStretch } = useSettingsContext();
    const { query } = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const [usuario, setUsuario] = useState<ApolloFormSchemaCustomValues[]>();
    const [areas, setAreas] = useState<string[]>();

    const buscarPorId = async id => {

        setLoading(true);
        
        const u = await new UsuarioController().BuscarPorId(id);

        if (!u || u === null) {
            enqueueSnackbar('Falha ao carregar dados do usuário', { variant: 'error', autoHideDuration: null });
            return;
        }

        const areasIds: string[] = [];

        setAreas(areasIds);

        setUsuario([
            { name: 'Id', value: u.Id },
            { name: 'Nome', value: u.Nome },
            { name: 'Email', value: u.Email },
            { name: 'Cpf', value: u.Cpf },
            { name: 'Adm', value: u.Adm },
            { name: 'Ativo', value: u.Ativo },
            { name: 'Comite', value: u.Comite },
            { name: 'RecebeNotificacao', value: u.RecebeNotificacao },
            { name: 'RecebeNotificacaoRelato', value: u.RecebeNotificacaoRelato },
        ]);

        setLoading(false);
    }
    
    useEffect(() => {
        if (query.id && Number(query.id)) {
            buscarPorId(query.id);
        }
    }, [query.id]);

    return (
        <CustomCard>
            <Head>
                <title>Edição de usuário</title>
            </Head>
            {loading && <LoadingScreen />}
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid item xs={12}>
                    <HeaderBreadcrumbs
                        heading={'Usuários'}
                        links={[
                            {
                                name: 'Usuários',
                                href: '/usuarios',
                            },
                            { name: 'Edição' },
                        ]}
                    />
                </Grid>
                <NewEditForm editMode customValues={usuario} values={{}} areas={areas ? areas : []} />
            </Container>
        </CustomCard>
    )
}
