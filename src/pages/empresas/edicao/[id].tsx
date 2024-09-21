// next
import { Container, Grid } from '@mui/material';
import { EmpresaController } from 'controllers/EmpresaController';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
    const { themeStretch } = useSettingsContext()
    const { query } = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [customValues, setCustomValues] = useState<ApolloFormSchemaCustomValues[]>()
    const [currentLogoId, setLogo] = useState<string>()
    const [currentBannerId, setBanner] = useState<string>()

    const loadData = id => {

        setLoading(true);

        try {
            const emp = new EmpresaController().GetEmpresaPorId(parseInt(id));
            
            setCustomValues([
                { name: 'Id', value: emp.Id },
                { name: 'UrlCodigoConduta', value: emp.UrlCodigoConduta },
                { name: 'Descricao', value: emp.Descricao },
                { name: 'RazaoSocial', value: emp.RazaoSocial },
                { name: 'Nome', value: emp.Nome },
                { name: 'Ativa', value: emp.Ativa },
                { name: 'Cnpj', value: emp.Cnpj },
            ]);

            if (emp.UrlLogo) setLogo(emp.UrlLogo);
            if (emp.UrlBanner) setBanner(emp.UrlBanner);
        } 
        catch (error) {}

        setLoading(false);
    }

    useEffect(() => {
        if (query.id && Number(query.id)) {
            loadData(query.id)
        }
    }, [query.id])

    return (
        <CustomCard>
            <Head>
                <title>Edição de empresa</title>
            </Head>
            {loading && <LoadingScreen />}
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid item xs={12}>
                    <HeaderBreadcrumbs
                        heading={'Empresas'}
                        links={[
                            {
                                name: 'Empresas',
                                href: '/empresas',
                            },
                            { name: 'Edição' },
                        ]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <NewEditForm
                        customValues={customValues}
                        currentLogoId={currentLogoId}
                        currentBannerId={currentBannerId}
                        values={{}}
                    />
                </Grid>
            </Container>
        </CustomCard>
    )
}
