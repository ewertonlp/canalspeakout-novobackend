import { Alert, Box, Dialog, DialogContent, Divider, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { UsuarioController } from 'controllers/UsuarioController';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { ApolloForm, ApolloFormSchemaItem } from 'src/components';
import { ApolloFormSchemaComponentType } from 'src/components/apollo-form/ApolloForm.component';
import { Imessage } from 'types/Imessage';
import { Usuario } from 'types/Usuario';
import { IconButtonAnimate } from '../../../components/animate';
import { CustomAvatar } from '../../../components/custom-avatar';
import MenuPopover from '../../../components/menu-popover';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_PAGE } from '../../../routes/paths';

// ----------------------------------------------------------------------

const OPTIONS = [
    {
        label: 'Home',
        linkTo: '/',
    },
    {
        label: 'Perfil',
        linkTo: PATH_PAGE.home,
    },
    {
        label: 'Configurações',
        linkTo: PATH_PAGE.home,
    },
]

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const { replace, push } = useRouter()

    const { enqueueSnackbar } = useSnackbar()

    const [openPopover, setOpenPopover] = useState<boolean>(false)

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget != null)
    }

    const handleClosePopover = () => {
        setOpenPopover(false)
    }

    const handleLogout = async () => {
        new UsuarioController().Logout()
    }

    const handleClickItem = (path: string) => {
        handleClosePopover()
        push(path)
    }

    const [openPasswordModal, setOpenPasswordModal] = useState(false)
    const { usuario } = useAuthContext()

    return (
        <>
            <IconButtonAnimate
                onClick={handleOpenPopover}
                sx={{
                    pl: 1,
                    ...(openPopover && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '95%',
                            height: '95%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: theme => alpha(theme.palette.grey[200], 0.5),
                        },
                    }),
                }}
            >
                <CustomAvatar alt={usuario?.Nome} name={usuario?.Nome} />
            </IconButtonAnimate>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                style={{margin: '4rem 0 0 -4rem'}}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Box sx={{ my: 1.5, px: 2.5,}}>
                    <Typography variant="subtitle2" noWrap>
                        {usuario?.Nome}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {usuario?.Email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {/* {OPTIONS.map(option => (
                        <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                            {option.label}
                        </MenuItem>
                    ))} */}
                    <MenuItem onClick={() => setOpenPasswordModal(true)}>Alterar senha</MenuItem>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                    Sair
                </MenuItem>
            </MenuPopover>
            <UpdatePasswordModal open={openPasswordModal} setOpen={setOpenPasswordModal} />
        </>
    )
}

export function UpdatePasswordModal({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [message, setMesssage] = useState<Imessage | null>(null)

    const onSubmit = async (u: Usuario) => {
        if (u.Senha !== u.SenhaConfirmacao) {
            setMesssage({ text: 'As senhas não coincidem', severity: 'error' });
            return;
        }
        
        try {
            await new UsuarioController().AlteraSenha(u);
            setMesssage({ text: 'Senha alterada com sucesso!', severity: 'success' });
        } 
        catch (error) {
            setMesssage({ text: `Erro ao alterar senha: ${error}`, severity: 'error' });
        }
    }

    const formSchema: ApolloFormSchemaItem[] = [
        {
            name: 'currentPassword',
            label: 'Digite sua senha atual',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.PASSWORD,
        },
        {
            name: 'password',
            label: 'Digite sua nova senha',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.PASSWORD,
        },
        {
            name: 'passwordConfirmation',
            label: 'Digite novamente sua nova senha',
            ui: { grid: 12 },
            required: true,
            componenttype: ApolloFormSchemaComponentType.PASSWORD,
        },
    ]

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <Typography variant="h4" paddingTop="18px" textAlign="center">
                    Alterar a senha
                </Typography>
                <DialogContent sx={{ padding: '0' }}>
                    <Grid item sx={{ textAlign: 'center' }} p={3}>
                        <Stack spacing={3}>
                            {message && <Alert severity={message.severity}>{message.text}</Alert>}
                        </Stack>
                        <ApolloForm
                            schema={formSchema}
                            onSubmit={onSubmit}
                            submitButtonText="Enviar"
                            defaultExpandedGroup={false}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}
