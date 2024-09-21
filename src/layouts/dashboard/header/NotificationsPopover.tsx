import {
    Avatar, Badge, Box, Button, Divider, IconButton, List,
    ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Stack, Tooltip, Typography,
} from '@mui/material';

import { noCase } from 'change-case';
import { useEffect, useState } from 'react';

import { NotificacaoController } from 'controllers/NotificacaoController';
import { NotificacaoUsuario } from 'types/NotificacaoUsuario';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/menu-popover';
import Scrollbar from '../../../components/Scrollbar';
import { fToNow } from '../../../utils/formatTime';

export default function NotificationsPopover() {

    const [notificacoes, setNotificacoes] = useState<NotificacaoUsuario[]>([]);

    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    }

    const handleClosePopover = () => {
        setOpenPopover(null);
    }

    const marcarComoLida = () => {
        setNotificacoes(
            notificacoes.map(n => ({
                ...n,
                Visualizada: false,
            })),
        )
    }

    const listaNotificacoes = async () => {
        
        try {
            
            let n = await new NotificacaoController().ListarNaoVisualizadasPorUsuario();

            if(!n || n === null || n.length == 0) n = [];

            setNotificacoes(n);
        }
        
        catch (error) {
            console.log('Erro ao listar notificações: '+error.error);
        }
    }

    useEffect(() => {listaNotificacoes();}, []);

    return (
        <>
            <IconButtonAnimate
                color={openPopover ? 'primary' : 'default'}
                onClick={handleOpenPopover}
                sx={{ width: 40, height: 40, pr: 2 }}
            >
                <Badge badgeContent={notificacoes.length} color="error">
                    <Iconify icon="eva:bell-fill" />
                </Badge>
            </IconButtonAnimate>

            <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 3 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">Notificações</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Você tem {notificacoes.length} mensagens não lidas
                        </Typography>
                    </Box>

                    {notificacoes && notificacoes.length > 0 && (
                        <Tooltip title=" Marcar como lida">
                            <IconButton color="primary" onClick={marcarComoLida}>
                                <Iconify icon="eva:done-all-fill" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                Novas
                            </ListSubheader>
                        }
                    >
                        {notificacoes.slice(0,2).map(n => (
                            <ItemNotificacao key={n.Id} n={n} />
                        ))}
                    </List>

                    <List disablePadding>
                        {notificacoes.slice(2, 5).map(n => (
                            <ItemNotificacao key={n.Id} n={n} />
                        ))}
                    </List>
                </Scrollbar>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button fullWidth disableRipple>
                        Ver todas
                    </Button>
                </Box>
            </MenuPopover>
        </>
    )
}

function ItemNotificacao({ n }: { n: NotificacaoUsuario }) {
    const { avatar, title } = renderizar(n);

    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px'
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>

            <ListItemText
                disableTypography
                primary={title}
                secondary={
                    <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
                        <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
                        <Typography variant="caption">{fToNow(n.Data ?n.Data.toLocaleDateString(): new Date)}</Typography>
                    </Stack>
                }
            />
        </ListItemButton>
    )
}

function renderizar(n: NotificacaoUsuario) {
    const title = (
        <Typography variant="subtitle2">
            {n.Titulo}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                &nbsp; {noCase(n.Descricao)}
            </Typography>
        </Typography>
    )

    if (n.IdRelato > 0) {
        return {
            avatar: <img alt={n.Titulo} src="/assets/icons/notification/ic_package.svg" />,
            title,
        }
    }
    else{
        return {
            avatar: <img alt={n.Titulo} src="/assets/icons/notification/ic_shipping.svg" />,
            title,
        }
    }
}
