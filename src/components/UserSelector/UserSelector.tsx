import AddIcon from '@mui/icons-material/Add'
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
// import { UsuarioController } from 'controllers/UsuarioController'
import { UsuarioController } from 'controllers/UsuarioController'
import { useEffect, useState } from 'react'
import { Usuario } from 'types/Usuario'

export const UserSelector = ({ onUserSelect, selectedUsers, postId }) => {
    const usuarioController = new UsuarioController();
    
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<Usuario[]>([])
    
    // const relatoController = new RelatoController()
    
    useEffect(() => {
        async function getUsers() {
            try {
                const usersData = await usuarioController.Listar(postId);
                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                    console.log(usersData);
                } else {
                    console.error('Expected an array, but got:', usersData);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        }
        getUsers()
    }, [postId])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleUserSelect = async user => {
        onUserSelect(user)
    }

    return (
        <>
            <Button
                variant="contained"
                sx={{ paddingX: '1rem', paddingY: '0.7rem', borderRadius: '30px' }}
                onClick={handleOpen}
            >
                <AddIcon /> Adicionar Usuário Temporário
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Selecione um usuário</DialogTitle>
                <DialogContent>
                    <List>
                        {users.map(user => (
                            <ListItem
                                key={user?.Id || user.Id}
                                role={undefined}
                                dense
                                button
                                onClick={() => handleUserSelect(user)}
                            >
                                <Checkbox
                                    edge="start"
                                    checked={selectedUsers.some(
                                        selectedUser => selectedUser.id === user?.Id,
                                    )}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={() => handleUserSelect(user)}
                                />

                                {user ? (
                                    <ListItemText
                                        primary={user.Nome}
                                        secondary={user.Email}
                                    />
                                ) : (
                                    <ListItemText primary="Usuário desconhecido" secondary="Email não disponível" />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
