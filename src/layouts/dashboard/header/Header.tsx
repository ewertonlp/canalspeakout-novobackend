import {
    AppBar,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EmpresaController } from 'controllers/EmpresaController';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import NoticeModal from 'src/components/NoticeModal';
import Iconify from '../../../components/iconify/Iconify';
import Logo from '../../../components/logo';
import { useSettingsContext } from '../../../components/settings';
import { HEADER, NAV } from '../../../config';
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import { bgBlur } from '../../../utils/cssStyles';
import AccountPopover from './AccountPopover';

import { UsuarioController } from 'controllers/UsuarioController';
import ThemeToggle from 'src/components/themeButton/themeButton';
import { Empresa } from 'types/Empresa';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

type Props = {
    onOpenNav?: VoidFunction
}

export default function Header({ onOpenNav }: Props) {
    const theme = useTheme()

    const { themeLayout } = useSettingsContext()
    const { themeMode, onToggleMode } = useSettingsContext()

    const isNavHorizontal = themeLayout === 'horizontal'

    const isNavMini = themeLayout === 'mini'

    const isDesktop = useResponsive('up', 'lg')

    const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal

    const [openModal, setOpenModal] = useState(false)

    const [selectValue, setSelectValue] = useState<{ label: string; value: string }>()

    const { usuario } = useAuthContext();

    const { push, asPath } = useRouter();

    const handleChange = (event: SelectChangeEvent) => {
        setOpenModal(true);

        let nome = empresas.find(emp => emp.id === event.target.value)?.Nome;

        setSelectValue({ value: event.target.value as string, label: nome ?? '' });
    }

    const [empresas, setEmpresas] = useState<Empresa[]>([])

    useEffect(() => {
        
            try {     
                setEmpresas(new EmpresaController().GetEmpresasAtivas());
            } 
            catch (error) {
                console.log('erro de empresa no dashboard/Header.tsx :'+error);
            }
    }, [])

    const isMainPage = (path: string) => {
        switch (path) {
            case '/relatorios/':
                return true;
            case '/relatos/':
                return true;
            case '/home/':
                return true;
            case '/usuarios/':
                return true;
            case '/areasdeatuacao/':
                return true;
            case '/empresas/':
                return true;
            case '/treinamentos/':
                return true;
            default:
                return false;
        }
    }

    const trocaEmpresa = async () => {
        
        try {
            if (usuario && selectValue) {

                usuario.idEmpresa = selectValue.value;

                usuario.IdEmpresa = Number(selectValue.value);

                new UsuarioController().TrocaEmpresa(selectValue.value);

                if (!isMainPage(asPath)) push('/relatos');

            }
        } 
        catch (error) {}

        setOpenModal(false);
    }

    const renderContent = (
        <>
            {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

            {!isDesktop && (
                <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
                    <Iconify icon="eva:menu-2-fill" />
                </IconButton>
            )}

            <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={{ xs: 1.5, sm: 1.5 }}
            >
                <Typography variant="h5" sx={{ color: 'text.primary' }}>
                    Olá {usuario?.Nome}
                </Typography>

                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                    {usuario?.Adm && (
                        <FormControl sx={{ width: '60%', marginTop: { xs: '8px', lg: '0px' } }}>
                            <InputLabel id="select-label">Empresa</InputLabel>
                            <Select
                                labelId="select-label"
                                id="select"
                                value={usuario.idEmpresa}
                                label="Empresa"
                                onChange={handleChange}
                                sx={{ borderRadius: '10px', paddingLeft: '0.3rem', backgroundColor:'card.default' }}
                            >
                                {empresas.map(emp => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.Nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <ThemeToggle themeMode={themeMode} onToggleMode={onToggleMode} />
                    
                    <NotificationsPopover />
                    <AccountPopover />
                    <NoticeModal
                        open={openModal}
                        setOpen={setOpenModal}
                        handleOk={trocaEmpresa}
                        text={
                            selectValue?.label
                                ? `Tem certeza que deseja trocar para a empresa ${selectValue.label}?`
                                : 'Tem certeza que deseja trocar de empresa?'
                        }
                        title="Aviso"
                    />
                </Stack>
            </Stack>
        </>
    )

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,

                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(isDesktop && {
                    width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
                    height: HEADER.H_DASHBOARD_DESKTOP,
                    bgcolor: 'background.default',
                    ...(isOffset && {
                        height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
                    }),
                    ...(isNavHorizontal && {
                        width: 1,
                        bgcolor: 'background.default',
                        height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
                        borderBottom: theme => `dashed 1px ${theme.palette.divider}`,
                    }),
                    ...(isNavMini && {
                        width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
                    }),
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 5 },
                }}
            >
                {renderContent}
            </Toolbar>
        </AppBar>
    )
}
