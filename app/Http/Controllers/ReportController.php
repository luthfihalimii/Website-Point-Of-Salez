<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    // Method untuk menampilkan laporan penjualan berdasarkan rentang tanggal.
    public function salesreport(Request $request)
    {
        // Membuat query untuk mengambil transaksi dengan tipe 'SALE'.
        $query = Transaction::query()->where('type', 'SALE');

        // Menyaring transaksi berdasarkan rentang tanggal yang diterima dari request.
        // Pastikan dari frontend sudah mengirim 'from' dan 'to' dengan format yang benar.
        $query->whereBetween('transaction_date', [
            $request->from,
            $request->to
        ]);

        // Mengambil transaksi yang sudah difilter, diurutkan berdasarkan tanggal secara ascending.
        $transactions = $query->orderBy('transaction_date', 'asc')->get();

        // Mengirim data transaksi ke tampilan 'SalesReport' menggunakan Inertia.
        return Inertia::render('Report/SalesReport', [
            'transactions' => $transactions
        ]);
    }

    public function salesreportchart(Request $request)
    {
        // Membuat query untuk mengambil transaksi dengan tipe 'SALE'.
        $query = Transaction::query()->where('type', 'SALE');

        // Menyaring transaksi berdasarkan rentang tanggal yang diterima dari request.
        // Pastikan dari frontend sudah mengirim 'from' dan 'to' dengan format yang benar.
        $query->whereBetween('transaction_date', [
            $request->from,
            $request->to
        ]);

        // Mengambil transaksi yang sudah difilter, diurutkan berdasarkan tanggal secara ascending.
        $transactions = $query->orderBy('transaction_date', 'asc')->get();

        // Mengirim data transaksi ke tampilan 'SalesReport' menggunakan Inertia.
        return Inertia::render('Report/SalesReportChart', [
            'transactions' => $transactions
        ]);
    }

    public function purchasesreport(Request $request)
    {
        // Membuat query untuk mengambil transaksi dengan tipe 'SALE'.
        $query = Transaction::query()->where('type', 'PURCHASE');

        // Menyaring transaksi berdasarkan rentang tanggal yang diterima dari request.
        // Pastikan dari frontend sudah mengirim 'from' dan 'to' dengan format yang benar.
        $query->whereBetween('transaction_date', [
            $request->from,
            $request->to
        ]);

        // Mengambil transaksi yang sudah difilter, diurutkan berdasarkan tanggal secara ascending.
        $transactions = $query->orderBy('transaction_date', 'asc')->get();

        // Mengirim data transaksi ke tampilan 'SalesReport' menggunakan Inertia.
        return Inertia::render('Report/PurchasesReport', [
            'transactions' => $transactions
        ]);
    }
}
