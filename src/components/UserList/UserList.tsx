import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { RelatoController } from 'controllers/RelatoController'
import { RelatoUsuarioController } from 'controllers/RelatoUsuarioController'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useAuthContext } from 'src/auth/useAuthContext'
import { UserSelector } from '../UserSelector'
import { RelatoUsuario } from 'types/RelatoUsuario'

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #a3a3a3',
}))

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    margin: '4rem auto',
    padding: '1rem',
    borderRadius: 10,

    '&:hover': {
        boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.16)',
    },
}))

interface UserListProps {
    postId: number
    selectedUsers: RelatoUsuario[]
    setSelectedUsers: (users: RelatoUsuario[]) => void
}

export const UserList = ({ postId, selectedUsers, setSelectedUsers }: UserListProps) => {
    const [loading, setLoading] = useState(false)
    const relatoController = new RelatoController()
    const relatoUsuarioController = new RelatoUsuarioController()
    const { enqueueSnackbar } = useSnackbar()
    const [deleteUserId, setDeleteUserId] = useState('')
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const theme = useTheme()

    const borderColor = theme.palette.mode === 'dark' ? '#424249' : '#d2d2d2'

    const { usuario } = useAuthContext()

    const fetchUsers = async () => {
        setLoading(true)
        const response = await new RelatoUsuarioController().ListarPorRelato(postId);

        console.log('relatoBuscado');

        console.log(response);

        if (response && response.length > 0) {
            const users: RelatoUsuario[] = response.map(user => ({
                IdRelato: postId,
                IdUsuario: user.IdUsuario ? Number(user.IdUsuario) : 0,
                Usuario: user.Usuario,
                Email: user.Email,
            }))
            console.log('usuariosTemp');
            console.log(users);
            setSelectedUsers(users)
        }
        setLoading(false)
    }

    const salvarUsuario = async usuario => {

        const u = {
            IdRelato: postId,
            IdUsuario: Number(usuario.Id),
            Usuario: usuario.Nome,
            Email: usuario.Email
        };

        await new RelatoUsuarioController().Salvar(u);
    }

    const handleUserSelect = async user => {
        let updatedUsers;

        if (selectedUsers.find(selectedUser => selectedUser.IdUsuario === Number(user.Id))) {
            updatedUsers = selectedUsers.filter(selectedUser => selectedUser.IdUsuario !== Number(user.Id));
        } 
        else {
            updatedUsers = [...selectedUsers, user];
        }

        setSelectedUsers(updatedUsers);

        await salvarUsuario(user);
    }

    const handleDeleteConfirmation = id => {
        setDeleteUserId(id)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        const newSelectedUsers = selectedUsers.filter(user => user.IdUsuario !== Number(deleteUserId))
        setSelectedUsers(newSelectedUsers)
        // await relatoController.Salvar(postId)
        setDeleteModalOpen(false)
    }

   
    useEffect(() => {
        fetchUsers()
    }, [postId])

    return (
        <>
            <Box display="flex" justifyContent="flex-end">
                {usuario?.Adm && (
                    <UserSelector postId={postId} selectedUsers={selectedUsers} onUserSelect={handleUserSelect} />
                )}
            </Box>
            <StyledCard sx={{ border: `1px solid ${borderColor}` }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Usuários do Comitê</Typography>
                    </Box>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <List sx={{ marginTop: '20px' }}>
                                {selectedUsers.map((selectedUser, index) => (
                                    <>
                                        <StyledListItem key={selectedUser.IdUsuario}>
                                            <ListItemText
                                                primary={selectedUser.Usuario}
                                                secondary={selectedUser.Email}
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Enviar convite">
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="mail"
                                                        // onClick={() => handleSendEmail(selectedUser)}
                                                        sx={{
                                                            marginX: 1,
                                                            '&:hover': {
                                                                color: 'primary.main', // Altere para a cor desejada
                                                            },
                                                        }}
                                                    >
                                                        {usuario?.Adm && <SendIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir usuário">
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleDeleteConfirmation(selectedUsers[0].IdUsuario)}
                                                        sx={{
                                                            '&:hover': {
                                                                color: '#FF5630',
                                                            },
                                                        }}
                                                    >
                                                        {usuario?.Adm && <DeleteIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </StyledListItem>
                                        {index !== selectedUsers.length - 1 && <Divider />}
                                    </>
                                ))}
                            </List>
                        </>
                    )}
                </CardContent>
            </StyledCard>
            <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle textAlign={'center'}>Confirmar Exclusão</DialogTitle>
                <DialogContent>Tem certeza que deseja excluir o usuário?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)} size="large">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error" size="large">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
