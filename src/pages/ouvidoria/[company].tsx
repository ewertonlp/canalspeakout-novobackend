import { Box, Grid, Typography } from '@mui/material'
import { EmpresaController } from 'controllers/EmpresaController'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from 'src/components/Loading'
import AppBar from 'src/components/ouvidoria/AppBar'
import { ButtonsGroup } from 'src/components/ouvidoria/ButtonsGroup'
import NoCompany from 'src/components/ouvidoria/NoCompany'
import { FooterCustom } from 'src/layouts/main/FooterCustom'
import { Empresa } from 'types/Empresa'

function Home() {
    const router = useRouter();
    const cnpj = router.query.company;
    const [empresa, setInfoEmpresa] = useState<Empresa>();
    const [noCompany, setNoCompany] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!router.isReady) return;

        const getInfo = async () => {

            setLoading(true);
            
            if (String(cnpj).length && String(cnpj).length == 18) {
                
                let emp = await new EmpresaController().BuscarPorCnpj(String(cnpj));

                if(emp !== null){
                    setInfoEmpresa(emp);
                    sessionStorage.setItem('idEmpresa',JSON.stringify(emp.Id));
                    setNoCompany(false);
                    setLoading(false);
                }

                else{
                    setNoCompany(true);
                    setLoading(false);
                    throw Error('Empresa não econtrada.');
                }
            }

            else {
                setLoading(false);
                throw Error('Empresa não existe.');
            }
        }
        getInfo()
    }, [router.isReady])

    if (loading) return <Loading />

    if (noCompany || !empresa?.Ativa) return <NoCompany />

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Head>
                <title>Página de Relatos {empresa?.Nome}</title>
            </Head>
            <Grid container>
                <AppBar logoUrl={empresa?.UrlLogo ? (empresa?.UrlLogo as string) : ''} />
            </Grid>
            <Box sx={{ padding: '30px 10px' }}>
                <Grid container alignItems="start" justifyContent="space-between" rowGap={'2rem'} mt={'4rem'}>
                    <Grid item xs={12} lg={5} sx={{ ml: '7rem' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h3" color={'#1D1D1E'} textAlign={'left'}>
                                    {empresa?.RazaoSocial}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4" color={'black'} fontWeight="300" textAlign={'left'}>
                                    {empresa?.Descricao}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonsGroup text="Denuncie aqui" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <img src={empresa?.UrlBanner} alt="" style={{ borderRadius: '10px' }} />
                    </Grid>
                </Grid>
                <Grid
                    container
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '3rem' }}
                >
                    <Grid
                        item
                        xs={10.5}
                        sx={{ border: '1px solid #637381', borderRadius: '10px', backgroundColor: '#ebebeb' }}
                    >
                        <Typography variant="h3" color="#1D1D1E" textAlign="center" sx={{ margin: '20px 0' }}>
                            Como funciona
                        </Typography>
                        <Typography
                            variant="h6"
                            marginBottom={6}
                            fontWeight="normal"
                            textAlign={'justify'}
                            paddingX={'6%'}
                            color="#1D1D1E"
                        >
                            O canal de relatos é mais que um canal para atendimento da legislação. Levamos a sério o
                            compromisso da dignidade da pessoa humana, e por isso, o canal torna-se a maior ferramenta
                            de diálogo entre empregador e colaboradores. Incidentes relacionados a condutas
                            inapropriadas devem ser reportados neste site ou pelo telefone, disponível 24 horas por dia,
                            sete dias por semana. Algumas situações que podem ser registradas são: assédio
                            moral/comportamento inadequado; assédio sexual; corrupção; conflito de interesses; fraude;
                            roubos e furtos; uso indevido de informações privilegiadas ou confidenciais.
                            <br /> As informações registradas neste canal serão recebidas e tratadas por uma empresa
                            independente e especializada que tem por obrigação assegurar o{' '}
                            <strong color='#000'>sigilo absoluto</strong> e o tratamento adequado das informações, sem conflito de
                            interesses. Caso prefira denunciar via WhatsApp também é possível. É comum os casos em que
                            mulheres são vítimas de assédio sexual e assédio moral no trabalho, tendo que esconderem a
                            situação de sua família e colegas, com medo de represália e perda do emprego. Aqui,
                            garantimos seu direito de ser ouvido, bem como, tratamos de forma profissional os casos
                            denunciados em nosso portal
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <FooterCustom />
        </Box>
    )
}

export default Home
