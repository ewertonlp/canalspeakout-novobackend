import { ListItemButtonProps, StackProps } from '@mui/material'

// ----------------------------------------------------------------------

export type INavItem = {
    item: NavListProps
    depth: number
    open?: boolean
    active?: boolean
    isExternalLink?: boolean
}

export type NavItemProps = INavItem & ListItemButtonProps

export type NavListProps = {
    title: string
    path: string
    adminOnly?: boolean
    icon?: React.ReactElement
    info?: React.ReactElement
    caption?: string
    disabled?: boolean
    roles?: string[]
    children?: any
}

export interface NavSectionProps extends StackProps {
    data: {
        subheader: string
        items: NavListProps[]
    }[]
}
