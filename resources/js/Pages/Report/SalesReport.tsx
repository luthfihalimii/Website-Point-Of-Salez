import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import type { PageProps, Transaction } from '@/types'
import { Head, router } from '@inertiajs/react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import * as XLSX from 'xlsx'

interface SalesSummary {
    gross: number
    discount: number
    tax: number
    net: number
}

interface ReportSalesProps extends PageProps {
    transactions: Transaction[]
    summary: SalesSummary
    filters: {
        from: string
        to: string
        user_id?: number
        partner_id?: number
    }
}

const currency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)

export default function SalesReport({ transactions, summary, filters }: ReportSalesProps) {
    const initialRange: DateRange | undefined = filters.from && filters.to
        ? {
            from: parseISO(filters.from),
            to: parseISO(filters.to),
        }
        : undefined

    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange)

    const handleDateSelect = (selected: DateRange | undefined) => {
        setDateRange(selected)
        if (selected?.from && selected?.to) {
            router.get(
                route('sales-report'),
                {
                    from: format(selected.from, 'yyyy-MM-dd'),
                    to: format(selected.to, 'yyyy-MM-dd'),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            )
        }
    }

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new()
        const title = [['Sales Report']]
        const dateInfo = [[
            'From',
            filters.from,
            'To',
            filters.to,
        ]]

        const headers = [[
            'Transaction No',
            'Date',
            'Partner',
            'Payment Method',
            'Notes',
            'Total Amount',
        ]]

        const rows = transactions.map((transaction) => [
            transaction.no_transaction,
            transaction.transaction_date
                ? format(new Date(transaction.transaction_date), 'yyyy-MM-dd HH:mm')
                : '-',
            transaction.partner?.name ?? 'Walk-in',
            transaction.payment_method ?? '-',
            transaction.notes ?? '-',
            transaction.total_amount,
        ])

        const summaryRows = [
            [],
            ['Gross', '', '', '', '', summary.gross],
            ['Discount', '', '', '', '', summary.discount],
            ['Tax', '', '', '', '', summary.tax],
            ['Net', '', '', '', '', summary.net],
        ]

        const worksheet = XLSX.utils.aoa_to_sheet([
            ...title,
            [''],
            ...dateInfo,
            [''],
            ...headers,
            ...rows,
            ...summaryRows,
        ])

        worksheet['!cols'] = [
            { wch: 22 },
            { wch: 18 },
            { wch: 22 },
            { wch: 15 },
            { wch: 25 },
            { wch: 15 },
        ]

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales_Report')
        XLSX.writeFile(workbook, 'sales_report.xlsx')
    }

    return (
        <Authenticated>
            <Head title='Sales Report' />
            <div className='space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h1 className='text-2xl font-semibold'>Sales Report</h1>
                    {transactions.length > 0 && (
                        <Button onClick={exportToExcel}>Export to Excel</Button>
                    )}
                </div>

                <div className='grid gap-4 md:grid-cols-4'>
                    <SummaryCard label='Gross Sales' value={summary.gross} />
                    <SummaryCard label='Discount' value={summary.discount} negative />
                    <SummaryCard label='Tax' value={summary.tax} />
                    <SummaryCard label='Net Revenue' value={summary.net} highlight />
                </div>

                <Card>
                    <CardHeader className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <CardTitle className='text-lg font-semibold'>Date Range</CardTitle>
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
                                        dateRange.to ? (
                                            `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                                        ) : (
                                            format(dateRange.from, 'LLL dd, y')
                                        )
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
                    <CardContent className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction No</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className='text-right'>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className='py-6 text-center text-sm text-muted-foreground'>
                                            No transactions found for the selected period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className='font-medium'>{transaction.no_transaction}</TableCell>
                                            <TableCell>
                                                {transaction.transaction_date
                                                    ? format(new Date(transaction.transaction_date), 'dd MMM y HH:mm')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{transaction.partner?.name ?? 'Walk-in'}</TableCell>
                                            <TableCell>{transaction.payment_method ?? '-'}</TableCell>
                                            <TableCell>{transaction.notes ?? '-'}</TableCell>
                                            <TableCell className='text-right'>{currency(transaction.total_amount)}</TableCell>
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
                <p className={cn('text-2xl font-semibold', negative && 'text-red-600', highlight && 'text-emerald-700')}>
                    {currency(value)}
                </p>
            </CardContent>
        </Card>
    )
}
