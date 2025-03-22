import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import { Transaction } from '@/types'
import { Head, router } from '@inertiajs/react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'

interface ReportPurchasesProps {
    transactions: Transaction[]
}

export default function PurchasesReport({ transactions }: ReportPurchasesProps) {

    // State untuk menyimpan rentang tanggal yang dipilih, diinisialisasi dengan undefined.
    // Bisa langsung menggunakan undefined tanpa objek kosong jika tidak diperlukan.
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined
    })

    // Fungsi untuk menangani pemilihan tanggal.
    // Memastikan bahwa kedua tanggal (from dan to) dipilih sebelum melakukan navigasi ke "/purchases-report".
    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate)
        if (selectedDate?.from && selectedDate.to) {
            // Mengirim permintaan untuk mendapatkan laporan penjualan berdasarkan rentang tanggal yang dipilih.
            router.get("/purchases-report", {
                from: format(selectedDate.from, "yyyy-MM-dd"),
                to: format(selectedDate.to, "yyyy-MM-dd"),
            })
        }
    }

    // Fungsi untuk menonaktifkan tanggal yang lebih besar dari hari ini.
    // Ini mencegah pengguna memilih tanggal di masa depan.
    const disableDate = (date: Date) => {
        return date > new Date()
    }

    // Menghitung total amount dari semua transaksi.
    // Pastikan transactions sudah terdefinisi dan memiliki properti total_amount.
    const totalAmount = transactions.reduce(
        (sum, transactions) => sum + transactions.total_amount,
        0
    )


    return (
        <Authenticated>
            <Head title='Purchases Sales' />

            <div className='p-6'>
                <Card className='dark:border-gray-800'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-8 pb-7'>
                        <CardTitle className='text-2xl font-bold'>
                            Purchases Report
                        </CardTitle>
                        <div className='flex items-center space-x-4'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        id='date'
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className='mr-2 size-4' />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <div className='p-3 bg-popover text-popover-foreground'>
                                        <Calendar
                                            mode='range'
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={handleDateSelect}
                                            numberOfMonths={2}
                                            disabled={disableDate}
                                            className='flex space-x-4'
                                        />
                                    </div>

                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className='dark:border-gray-800'>
                                    <TableHead>Transaction No</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className='text-right'>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                    >
                                        <TableCell>{transaction.no_transaction}</TableCell>
                                        <TableCell>
                                            {transaction.transaction_date ?
                                                format(new Date(transaction.transaction_date),
                                                    "LLL dd, y",
                                                ) : "-"
                                            }
                                        </TableCell>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell>{transaction.notes || "-"}</TableCell>
                                        <TableCell className='text-right'>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(transaction.total_amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className='font-bold'>
                                    <TableCell>Total</TableCell>
                                    <TableCell className='text-right'>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalAmount)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
