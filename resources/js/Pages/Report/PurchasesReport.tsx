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

interface PurchasesSummary {
    total_purchases: number
}

interface PurchasesReportProps extends PageProps {
    transactions: Transaction[]
    summary: PurchasesSummary
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

export default function PurchasesReport({ transactions, summary, filters }: PurchasesReportProps) {
    const initialRange: DateRange | undefined = filters.from && filters.to ? {
        from: parseISO(filters.from),
        to: parseISO(filters.to),
    } : undefined

    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange)

    const handleDateSelect = (selected: DateRange | undefined) => {
        setDateRange(selected)
        if (selected?.from && selected.to) {
            router.get(route('purchases-report'), {
                from: format(selected.from, 'yyyy-MM-dd'),
                to: format(selected.to, 'yyyy-MM-dd'),
            }, {
                preserveScroll: true,
                preserveState: true,
            })
        }
    }

    return (
        <Authenticated>
            <Head title='Purchase Report' />
            <div className='space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h1 className='text-2xl font-semibold'>Purchase Report</h1>
                    <div className='text-sm text-muted-foreground'>Total spend: {currency(summary.total_purchases)}</div>
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
                    <CardContent className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction No</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className='text-right'>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className='py-6 text-center text-sm text-muted-foreground'>
                                            No purchases recorded for the selected period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className='font-medium'>{transaction.no_transaction}</TableCell>
                                            <TableCell>
                                                {transaction.transaction_date
                                                    ? format(new Date(transaction.transaction_date), 'dd MMM y')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{transaction.partner?.name ?? '-'}</TableCell>
                                            <TableCell>{transaction.notes ?? '-'}</TableCell>
                                            <TableCell className='text-right'>{currency(transaction.total_amount)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                                <TableRow className='font-semibold'>
                                    <TableCell colSpan={4}>Total</TableCell>
                                    <TableCell className='text-right'>{currency(summary.total_purchases)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
