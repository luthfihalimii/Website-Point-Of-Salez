import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTooltip } from '@/components/ui/chart'
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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface ReportSalesProps {
    transactions: Transaction[]
}

export default function SalesReportChart({ transactions }: ReportSalesProps) {

    // State untuk menyimpan rentang tanggal yang dipilih, diinisialisasi dengan undefined.
    // Bisa langsung menggunakan undefined tanpa objek kosong jika tidak diperlukan.
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined
    })

    // Fungsi untuk menangani pemilihan tanggal.
    // Memastikan bahwa kedua tanggal (from dan to) dipilih sebelum melakukan navigasi ke "/sales-report".
    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate)
        if (selectedDate?.from && selectedDate.to) {
            // Mengirim permintaan untuk mendapatkan laporan penjualan berdasarkan rentang tanggal yang dipilih.
            router.get("/sales-report-chart", {
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

    /** Menggunakan reduce untuk merangkum total transaksi berdasarkan tanggal */
    const chartData = transactions.reduce((acc: { date: string; total: number }[], transaction) => {
        /**
         * Format tanggal transaksi menjadi "MMM dd" (contoh: "Jan 01", "Feb 15")
         * Cari apakah sudah ada entri dengan tanggal yang sama di accumulator (acc)
        */
        const date = format(new Date(transaction.transaction_date ?? ""), "MMM dd")
        const existingData = acc.find((item) => item.date === date)

        /** Jika sudah ada, tambahkan total_amount transaksi ke entri yang sudah ada */
        if (existingData) {
            existingData.total += transaction.total_amount
        } else {
            /** Jika belum ada, tambahkan entri baru dengan date dan total_amount transaksi saat ini */
            acc.push({ date, total: transaction.total_amount })
        }
        return acc
    }, [])


    return (
        <Authenticated>
            <Head title='Report Sales (Chart)' />

            <div className='p-6'>
                <Card className='dark:border-gray-800'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-8 pb-7'>
                        <CardTitle className='text-2xl font-bold'>
                            Sales Report (Chart)
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
                        <div className='flex flex-col gap-4'>
                            <div className='h-[300px] sm:h-[400px] lg:h-[500px] w-full'>
                                {/* Membungkus BarChart agar responsif, mengikuti lebar 100% dari container dan tinggi 65% */}
                                <ResponsiveContainer width="100%" height="65%">
                                    {/* BarChart untuk menampilkan data dalam bentuk diagram batang */}
                                    <BarChart
                                        data={chartData} // Data yang digunakan untuk membuat chart
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 65,
                                            bottom: 20
                                        }}
                                    >
                                        {/* Menampilkan grid latar belakang dengan garis putus-putus */}
                                        <CartesianGrid strokeDasharray="3 3" />

                                        {/* Sumbu X untuk menampilkan tanggal */}
                                        <XAxis
                                            dataKey="date" // Menggunakan properti "date" dari chartData untuk label di sumbu X
                                            tickLine={false} // Menyembunyikan garis kecil di tiap label X
                                            axisLine={false} // Menyembunyikan garis utama sumbu X
                                            padding={{ left: 20, right: 20 }} // Memberikan sedikit ruang di sisi kiri dan kanan grafik
                                        />

                                        {/* Sumbu Y untuk menampilkan total jumlah transaksi */}
                                        <YAxis
                                            // Memformat angka di sumbu Y menjadi format Rupiah (IDR)
                                            tickFormatter={(value) => new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0
                                            }).format(value)}
                                            tickLine={false} // Menyembunyikan garis kecil di tiap label Y
                                            axisLine={false} // Menyembunyikan garis utama sumbu Y
                                        />

                                        {/* Tooltip yang muncul saat kursor diarahkan ke batang chart */}
                                        <ChartTooltip
                                            formatter={(value: number) => new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0
                                            }).format(value)}
                                        />

                                        {/* Batang (bar) utama untuk menampilkan total transaksi */}
                                        <Bar
                                            dataKey={"total"} // Menggunakan properti "total" dari chartData sebagai tinggi batang
                                            fill='#8884d8' // Warna batang
                                            radius={[4, 4, 0, 0]} // Memberikan efek sudut melengkung di bagian atas batang
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
