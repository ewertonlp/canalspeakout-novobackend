import AddIcon from '@mui/icons-material/Add'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import { RelatoAcaoController } from 'controllers/RelatoAcaoController'
import { RelatoArquivoController } from 'controllers/RelatoArquivoController'
import { UsuarioController } from 'controllers/UsuarioController'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { RelatoUsuarioController } from 'controllers/RelatoUsuarioController'
import { Relato } from 'types/Relato'
import { RelatoAcao } from 'types/RelatoAcao'
import { RelatoArquivo } from 'types/RelatoArquivo'
import { RelatoUsuario } from 'types/RelatoUsuario'
import { NewActionModal } from '../NewActionModal'
import ActionCard from '../ouvidoria/ActionCard'

function ActionsPage({ relato }: { relato: Relato; getRelato: (id: string) => void }) {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [deleteAction, setDeleteAction] = useState<string>('')
    const [acoes, setAcoes] = useState<RelatoAcao[]>([])
    const [arquivos, setArquivos] = useState<RelatoArquivo[]>([])
    const [usuarios, setUsuarios] = useState<RelatoUsuario[]>([])
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

    const { push, query } = useRouter()

    const buscarAcoes = async () => {
        try {
            const a = await new RelatoAcaoController().ListarPorRelato(relato.Id)
            setAcoes(a)

            if (a && a.length > 0) {
                const arqs = await new RelatoArquivoController().ListarPorRelato(relato.Id)
                setArquivos(arqs)

                // const u = await new RelatoUsuarioController().ListarPorRelato(relato.Id)
                // setUsuarios(u)
            }
        } catch (error) {
            enqueueSnackbar(`Erro ao buscar ações: ${error.error}`, { variant: 'error' })
            console.error(error)
        }
    }

    const buscarUsuarios = async () => {
        try {
            const u = await new RelatoUsuarioController().ListarPorRelato(relato.Id);
            setUsuarios(u);
        } catch (error) {
            enqueueSnackbar(`Erro ao buscar usuários: ${error.message}`, { variant: 'error' });
        }
    };

    const excluirAcao = async (id: number) => {
        if (deleteAction) {
            try {
                await new RelatoAcaoController().Excluir(relato.Id)
                enqueueSnackbar('Ação excluída com sucesso', { variant: 'success' })
                await buscarAcoes()
            } catch (error) {
                console.error('Erro ao excluir a ação:', error)
                enqueueSnackbar('Erro ao excluir a Ação', { variant: 'error' })
            } finally {
                setDeleteModalOpen(false)
                setDeleteAction('')
            }
        }
    }

    const confirmarExclusao = (id: string) => {
        setDeleteAction(id)
        setDeleteModalOpen(true)
    }

    useEffect(() => {
        buscarAcoes()
        buscarUsuarios()
    }, [acoes, relato.Id])

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
                {new UsuarioController().GetUsuarioLogado().Adm && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ paddingX: '1rem', paddingY: '0.7rem', borderRadius: '30px' }}
                        onClick={() => setOpenModal(true)}
                    >
                        <AddIcon /> Cadastrar Nova ação
                    </Button>
                )}
            </Grid>
            {(acoes.length > 0 &&
                acoes.map((a, index) => (
                    <div
                        key={index}
                        onClick={() => push(`/relatos/detalhes/edit-action/${a.Id}?post=${query.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ActionCard
                            id={a.Id.toString()}
                            date={a.DataCad.toString()!}
                            name={a.Usuario ? a.Usuario : 'Desconhecido'}
                            title={a.Titulo}
                            description={a.Descricao}
                            status={a.Status}
                            lastUpdateDate={a.DataAlt.toString() ? a.DataAlt.toString() : ''}
                            files={arquivos}
                            lightShadow
                            biggerPadding
                            onDelete={() => excluirAcao(a.Id)}
                        />
                    </div>
                ))) || (
                <Typography variant="h5" textAlign={'center'} fontWeight={500}>
                    Ainda não existe Ações para exibir
                </Typography>
            )}
            <NewActionModal usuarios={usuarios} setOpen={setOpenModal} open={openModal} />
            <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle textAlign={'center'}>Confirmar Exclusão</DialogTitle>
                <DialogContent>Tem certeza que deseja excluir esta Ação?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} size="large">
                        Cancelar
                    </Button>
                    <Button onClick={() => confirmarExclusao} color="error" size="large">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default ActionsPage
