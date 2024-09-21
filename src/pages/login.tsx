import { Box, Card, Grid, Link, Stack, Typography } from '@mui/material';
import { UsuarioController } from 'controllers/UsuarioController';
import Head from 'next/head';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import ApolloForm, { ApolloFormSchemaComponentType, ApolloFormSchemaItem } from 'src/components/apollo-form/ApolloForm.component';
import { Usuario } from 'types/Usuario';

// ----------------------------------------------------------------------

export default function Login() {
    return (
        <Grid 
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'card.default',
                padding: 0,
            }}
        >
            <Head>
                <title>Login</title>
            </Head>
            <Grid
                sx={{
                    display: 'flex',
                    flexDirection: { sm: 'row', xs: 'column' },
                    paddingTop: { xs: '20px', sm: '0px' },
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Grid
                    item
                    xs={6}
                    sx={{ backgroundColor: '#F0F2F5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Box
                        sx={{
                            height: { sm: '100vh', xs: '50vh' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: { xs: '50%', sm: '35%' },
                            backgroundColor: '#F0F2F5',
                        }}
                    >
                        <Typography sx={{ color: '#2D7999', mb: '1rem', textAlign:'center' }} variant="h3">
                            Sistema de Relatos
                        </Typography>
                        <img
                            src="/logo/logo_speakout.svg"
                            alt="Logo Speakout"
                        />
                    </Box>
                </Grid>
                <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                    <Card sx={{ maxWidth: '550px', border: '1px solid #adadad', my: 5 }}>
                        <Grid p={3}>
                            <Stack spacing={2} sx={{ mb: 1, mt: 1, position: 'relative' }}>
                                <Typography variant="h3" textAlign="center">
                                    Login
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}
                                >
                                </Stack>
                            </Stack>

                            <AuthLoginForm />
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    )
}

function AuthLoginForm() {

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (u: Usuario) => {
        try {
            await new UsuarioController().Logar(u);
        }
        catch (error) {
            enqueueSnackbar('Usuário não encontrado. E-Mail e / ou Senha pode(m) estar incorreto(s).', { variant: 'warning' });
        }
    }

    const formSchema: ApolloFormSchemaItem[] = [
        {
            name: 'Email',
            label: 'E-mail',
            ui: { grid: 12 },
            componenttype: ApolloFormSchemaComponentType.TEXT,
            required: true,
        },
        {
            name: 'Senha',
            label: 'Senha',
            ui: { grid: 12 },
            componenttype: ApolloFormSchemaComponentType.PASSWORD,
            required: true,
        },
    ]

    return (
        <>
            <ApolloForm
                schema={formSchema}
                onSubmit={onSubmit}
                submitButtonText="Entrar"
                defaultExpandedGroup={false}
                noRenderCardInForm
            />

            <Stack alignItems="center" sx={{ mt: 6, pb: { xs: '2rem' } }}>
                <NextLink href={'/forgot-password'} passHref>
                    <Link variant="body2" color="#2D7999" underline="always">
                        Esqueceu sua senha?
                    </Link>
                </NextLink>
            </Stack>
        </>
    )
}
