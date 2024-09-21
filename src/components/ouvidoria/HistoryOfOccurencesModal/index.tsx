import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { RelatoHistorico } from 'types/RelatoHistorico';
import ComplaintHistoryCard from '../ComplaintHistoryCard';

export function HistoryofOccurencesModal({
    historico,
    open,
    setOpen,
}: {
    historico: RelatoHistorico[]
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="scroll-dialog-title">
                    {history && history.length > 0 ? `Histórico` : `Sem histórico`}
                </DialogTitle>
                <DialogContent sx={{ padding: '0' }}>
                    <Grid
                        display="flex"
                        flexDirection="column"
                        rowGap="25px"
                        p={2}
                        item
                        lg={8}
                        xs={12}
                        margin="0 auto"
                        minHeight={'auto'}
                        sx={{ minWidth: { xs: '100%', md: '500px' } }}
                    >
                        {(historico &&
                            historico.length > 0 &&
                            historico.map((h, index) => (
                                <ComplaintHistoryCard
                                    key={index}
                                    date={h.DataCad}
                                    name={h.UsuarioCad}
                                    comment={h.Comentario}
                                />
                            ))) || (
                            <Typography variant="body1" textAlign={'center'} fontWeight={600}>
                                Solicitação em análise
                            </Typography>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
