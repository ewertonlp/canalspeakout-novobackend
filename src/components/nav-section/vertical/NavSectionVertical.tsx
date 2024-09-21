import { List, Stack } from '@mui/material';
import { UsuarioController } from 'controllers/UsuarioController';
import { NavSectionProps } from '../types';
import NavList from './NavList';
import { StyledSubheader } from './styles';

// ----------------------------------------------------------------------

export default function NavSectionVertical({ data, sx, ...other }: NavSectionProps) {
    // const { usuario } = useAuthContext();

    // console.log(usuario);

    return (
        <Stack sx={sx} {...other}>
            {data.map(group => {
                const key = group.subheader || group.items[0].title

                return (
                    <List key={key} disablePadding sx={{ px: 2 }}>
                        {group.subheader && <StyledSubheader disableSticky>{group.subheader}</StyledSubheader>}

                        {group.items.map(list =>
                            new UsuarioController().GetUsuarioLogado().Master ? (
                                <NavList
                                    key={list.title + list.path}
                                    data={list}
                                    depth={1}
                                    hasChild={!!list.children}
                                />
                            ) : (
                                !list.adminOnly && (
                                    <NavList
                                        key={list.title + list.path}
                                        data={list}
                                        depth={1}
                                        hasChild={!!list.children}
                                    />
                                )
                            ),
                        )}
                    </List>
                )
            })}
        </Stack>
    )
}
