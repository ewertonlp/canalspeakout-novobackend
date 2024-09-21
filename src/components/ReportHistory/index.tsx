import AddIcon from '@mui/icons-material/Add'
import { Button, Grid, Typography } from '@mui/material'
import { UsuarioController } from 'controllers/UsuarioController'
import { useState } from 'react'
import { RelatoHistorico } from 'types/RelatoHistorico'
import ComplaintHistoryCard from '../ouvidoria/ComplaintHistoryCard'
import { NewCommentModal } from '../ouvidoria/NewCommentModal'


function ReportHistory({ histories, getPost }: { histories: RelatoHistorico[]; getPost: (id: string) => void }) {
    const [openModal, setOpenModal] = useState<boolean>(false)

    const usuario = new UsuarioController().GetUsuarioLogado();

    return (
        <Grid
            style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '20px',
            }}
        >
            <Grid
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {usuario.Adm && (
                    <Button
                        variant="contained"
                        sx={{ paddingX: '2rem', paddingY: '0.6rem', borderRadius:'30px' }}
                        onClick={() => setOpenModal(true)}
                    >
                        <AddIcon sx={{ mr: 1 }} /> Nova Mensagem
                    </Button>
                )}
            </Grid>
            <Grid xs={8}>
                {(histories &&
                    histories.length > 0 &&
                    histories.map((post, index) => (
                        <ComplaintHistoryCard
                            key={index}
                            date={post.DataCad!}
                            name={post.UsuarioCad ? post.UsuarioCad : 'Desconhecido'}
                            comment={post.Comentario ? post.Comentario : ''}
                            files={post.Arquivo}
                            lightShadow
                            biggerPadding
                        />
                    ))) || (
                    <Typography variant="body1" textAlign={'center'} fontWeight={600}>
                        Ainda não existe histórico para exibir
                    </Typography>
                )}
            </Grid>
            <NewCommentModal setOpen={setOpenModal} open={openModal} getPost={getPost} />
        </Grid>
    )
}

export default ReportHistory
