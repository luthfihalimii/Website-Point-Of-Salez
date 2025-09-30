import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/ui/chart'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import type { PageProps } from '@/types'
import { Head, router } from '@inertiajs/react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface ChartRow {
    date: string
    net_total: number
}

interface SalesChartProps extends PageProps {
    chart: ChartRow[]
    filters: {
        from: string
        to: string
    }
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)

export default function SalesReportChart({ chart, filters }: SalesChartProps) {
    const initialRange: DateRange | undefined = filters.from && filters.to
        ? {
            from: parseISO(filters.from),
            to: parseISO(filters.to),
        }
        : undefined

    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange)

    const handleDateSelect = (selected: DateRange | undefined) => {
        setDateRange(selected)
        if (selected?.from && selected.to) {
            router.get(route('sales-report-chart'), {
                from: format(selected.from, 'yyyy-MM-dd'),
                to: format(selected.to, 'yyyy-MM-dd'),
            }, {
                preserveScroll: true,
                preserveState: true,
            })
        }
    }

    const chartData = useMemo(
        () => chart.map((row) => ({
            date: format(parseISO(row.date), 'dd MMM'),
            total: Number(row.net_total),
        })),
        [chart],
    )

    const totalSales = chartData.reduce((sum, item) => sum + item.total, 0)

    return (
        <Authenticated>
            <Head title='Sales Chart' />
            <div className='space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h1 className='text-2xl font-semibold'>Sales Chart</h1>
                    <div className='text-sm text-muted-foreground'>Total: {formatCurrency(totalSales)}</div>
                </div>

                <Card>
                    <CardHeader className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <CardTitle className='text-lg font-semibold'>Select Date Range</CardTitle>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id='date-range'
                                    variant='outline'
                                    className={cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !dateRange && 'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {dateRange?.from ? (
                                        dateRange.to
                                            ? `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                                            : format(dateRange.from, 'LLL dd, y')
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                                <div className='p-3'>
                                    <Calendar
                                        mode='range'
                                        selected={dateRange}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={2}
                                        toDate={new Date()}
                                        defaultMonth={dateRange?.from}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </CardHeader>
                    <CardContent>
                        <div className='h-[360px] w-full sm:h-[420px]'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={chartData} margin={{ top: 20, right: 24, left: 12, bottom: 12 }}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='date' tickLine={false} axisLine={false} />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => formatCurrency(Number(value))}
                                    />
                                    <ChartTooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey='total' fill='#0ea5e9' radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
