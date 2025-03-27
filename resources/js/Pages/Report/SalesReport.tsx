import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import * as XLSX from "xlsx";

interface ReportSalesProps {
  transactions: Transaction[];
}

export default function SalesReport({ transactions }: ReportSalesProps) {

  // State untuk menyimpan rentang tanggal yang dipilih, diinisialisasi dengan undefined.
  // Bisa langsung menggunakan undefined tanpa objek kosong jika tidak diperlukan.
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });


  // Fungsi untuk menangani pemilihan tanggal.
  // Memastikan bahwa kedua tanggal (from dan to) dipilih sebelum melakukan navigasi ke "/sales-report".
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      // Mengirim permintaan untuk mendapatkan laporan penjualan berdasarkan rentang tanggal yang dipilih.
      router.get(
        "/sales-report",
        {
          from: format(selectedDate.from, "yyyy-MM-dd"),
          to: format(selectedDate.to, "yyyy-MM-dd"),
        },
        {
          preserveState: true,
          preserveScroll: true,
        },
      );
    }
  };

  // Menghitung total amount dari semua transaksi.
  // Pastikan transactions sudah terdefinisi dan memiliki properti total_amount.
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.total_amount,
    0,
  );

  // Fungsi untuk menonaktifkan tanggal yang lebih besar dari hari ini.
  // Ini mencegah pengguna memilih tanggal di masa depan.
  const disableDate = (date: Date) => {
    return date > new Date();
  };

  //Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatToRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", // Gaya format sebagai mata uang
      currency: "IDR", // Kode mata uang Rupiah (Indonesia)
      minimumFractionDigits: 0, // Tidak menampilkan desimal
    }).format(amount);
  };


  // Fungsi untuk mengekspor data ke dalam file Excel
  const exportToExcel = () => {
    // Membuat workbook (file Excel baru)
    const workbook = XLSX.utils.book_new();

    // Membuat judul laporan
    const title = [["Sales Report"]];

    // Menambahkan rentang tanggal laporan
    const dateRange = [
      ["Dari Tanggal :", date?.from, "Sampai Tanggal :", date?.to],
    ];

    // Menambahkan header kolom
    const headers = [
      ["Type", "No Transaction", "Transaction Date", "Total Amount"],
    ];

    // Memformat data transaksi agar total_amount tampil dalam format Rupiah
    const formattedData = transactions.map((item) => ({
      ...item,
      total_amount: formatToRupiah(item.total_amount),
    }));

    // Menghitung total jumlah dari semua transaksi
    const totalAmount = transactions.reduce(
      (sum, item) => sum + item.total_amount,
      0,
    );

    // Menambahkan baris total ke dalam tabel
    const totalRow = [["Total", "", "", formatToRupiah(totalAmount)]];

    // Menggabungkan semua bagian laporan menjadi satu array
    const allRows = [
      ...title,
      [""],
      ...dateRange,
      [""],
      ...headers,
      ...formattedData.map((item) => [
        item.type,
        item.no_transaction,
        item.transaction_date,
        item.total_amount,
      ]),
      ...totalRow,
    ];

    // Membuat worksheet dari array data
    const worksheet = XLSX.utils.aoa_to_sheet(allRows);

    // Mengatur lebar kolom agar lebih rapi saat dilihat di Excel
    const columnWidths = [
      { wch: 15 }, // Type
      { wch: 25 }, // No Transaction
      { wch: 15 }, // Transaction Date
      { wch: 20 }, // Total Amount
    ];
    worksheet["!cols"] = columnWidths;

    // Menentukan rentang sel yang berisi data
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    // Memberikan border dan styling pada seluruh sel dalam rentang data
    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C }) ; // Referensi sel (misal: A1, B2)
        if (!worksheet[cellRef]) continue;

        worksheet[cellRef].s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
          font: {
            // Bold for title, headers and total
            bold: R === 0 || R === 4 || R === range.e.r,
          },
          alignment: {
            horizontal: C === 3 ? "right" : "left", // Right align amounts
            vertical: "center",
          },
        };
      }
    }

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales_Report");
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  return (
    <Authenticated>
      <Head title="Report sales" />

      <div className="p-6">
        {transactions.length >= 1 && (
          <div className="w-full container mx-auto mb-3 flex justify-end">
            <Button onClick={exportToExcel}>Export to Excel</Button>
          </div>
        )}

        <Card className="dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-2xl font-bold">Sales Report</CardTitle>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 bg-popover text-popover-foreground">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      disabled={disableDate}
                      className="flex space-x-4"

                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-800">
                  <TableHead>Transaction No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="dark:border-gray-800"
                  >
                    <TableCell>{transaction.no_transaction}</TableCell>
                    <TableCell>
                      {transaction.transaction_date
                        ? format(
                          new Date(transaction.transaction_date),
                          "LLL dd, y",
                        )
                        : "-"}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(transaction.total_amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold dark:border-gray-800">
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right">
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
  );
}
