import { ApexOptions } from 'apexcharts'
// @mui
import { useTheme, styled } from '@mui/material/styles'
import { Card, CardHeader, CardProps } from '@mui/material'
// utils
import { fNumber } from '../../../../utils/formatNumber'
// components
import Chart, { useChart } from '../../../../components/chart'

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400

const LEGEND_HEIGHT = 100

const StyledChart = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': {
        height: CHART_HEIGHT,
    },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        // alignContent: 'center',
        display: 'block',
        position: 'relative !important' as 'relative',
        borderTop: `solid 2px ${theme.palette.divider}`,
        paddingTop: '8px',
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}))

// ----------------------------------------------------------------------

interface Props extends CardProps {
    title?: string
    subheader?: string
    chart: {
        colors?: string[]
        series?: {
            label: string
            value: number
        }[]
        options?: ApexOptions
        dropShadow?: {
            enabled: boolean,
            enabledOnSeries: undefined,
            top: number,
            left: number,
            blur: number,
            color: string,
            opacity: number
        }
        
    }
}

export default function PizzaChart({ title, subheader, chart, ...other }: Props) {
    const theme = useTheme()

    const { colors, series, options } = chart

    const chartSeries = series?.map(i => i.value)

    const chartOptions = useChart({
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        colors,
        labels: series?.map(i => i.label),
        
        stroke: {
            colors: [theme.palette.background.paper],
        },
        legend: {
            floating: true,
            horizontalAlign: 'center',
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
        },
        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (value: number) => fNumber(value),
                title: {
                    formatter: (seriesName: string) => `${seriesName}`,
                },
            },
        },
        plotOptions: {
            pie: { donut: { labels: { show: false } } },
        },
        ...options,
    })

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <StyledChart dir="ltr">
                <Chart type="pie" series={chartSeries} options={chartOptions} height={280} />
            </StyledChart>
        </Card>
    )
}
