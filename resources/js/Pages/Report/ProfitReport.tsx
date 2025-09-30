import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import type { PageProps } from '@/types'
import { Head } from '@inertiajs/react'
import { format, parseISO } from 'date-fns'

interface ProfitRow {
    date: string
    revenue: number
    cost_of_goods: number
    purchase_spending: number
    gross_profit: number
    net_profit: number
}

interface ProfitSummary {
    revenue: number
    cost_of_goods: number
    purchase_spending: number
    gross_profit: number
    net_profit: number
}

interface ProfitReportProps extends PageProps {
    rows: ProfitRow[]
    summary: ProfitSummary
    filters: {
        from: string
        to: string
    }
}

const currency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)

export default function ProfitReport({ rows, summary, filters }: ProfitReportProps) {
    return (
        <Authenticated>
            <Head title='Profit Report' />
            <div className='space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <header className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-semibold'>Profit & Loss Overview</h1>
                        <p className='text-sm text-muted-foreground'>
                            {format(parseISO(filters.from), 'dd MMM y')} — {format(parseISO(filters.to), 'dd MMM y')}
                        </p>
                    </div>
                </header>

                <div className='grid gap-4 md:grid-cols-5'>
                    <SummaryCard label='Revenue' value={summary.revenue} />
                    <SummaryCard label='Cost of Goods' value={summary.cost_of_goods} negative />
                    <SummaryCard label='Purchase Spending' value={summary.purchase_spending} negative />
                    <SummaryCard label='Gross Profit' value={summary.gross_profit} />
                    <SummaryCard label='Net Profit' value={summary.net_profit} highlight />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold'>Daily Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className='text-right'>Revenue</TableHead>
                                    <TableHead className='text-right'>COGS</TableHead>
                                    <TableHead className='text-right'>Purchases</TableHead>
                                    <TableHead className='text-right'>Gross Profit</TableHead>
                                    <TableHead className='text-right'>Net Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className='py-6 text-center text-sm text-muted-foreground'>
                                            No profit data available for this period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.date}>
                                            <TableCell>{format(parseISO(row.date), 'dd MMM y')}</TableCell>
                                            <TableCell className='text-right'>{currency(row.revenue ?? 0)}</TableCell>
                                            <TableCell className='text-right text-red-600'>{currency(row.cost_of_goods ?? 0)}</TableCell>
                                            <TableCell className='text-right text-red-600'>{currency(row.purchase_spending ?? 0)}</TableCell>
                                            <TableCell className='text-right'>{currency(row.gross_profit ?? 0)}</TableCell>
                                            <TableCell className={cn('text-right font-semibold', (row.net_profit ?? 0) < 0 && 'text-red-600')}>
                                                {currency(row.net_profit ?? 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}

function SummaryCard({ label, value, negative, highlight }: { label: string; value: number; negative?: boolean; highlight?: boolean }) {
    return (
        <Card className={highlight ? 'border-emerald-200 bg-emerald-50' : undefined}>
            <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={cn('text-lg font-semibold md:text-xl', negative && 'text-red-600', highlight && 'text-emerald-700')}>
                    {currency(value)}
                </p>
            </CardContent>
        </Card>
    )
}
