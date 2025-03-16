<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('Transaction/Index', [
            'transaction' => Transaction::with('items.product')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Transaction/Create', [
            'products' => Product::with('category')->get()
        ]);
    }

    public function store(TransactionRequest $request)
    {

        $validated = $request->validated();

        /**
         * Mengambil tanggal saat ini dalam format "Y-m-d" (misal: 2025-03-15)
         * Menentukan prefix transaksi berdasarkan tipe ("tr-sale" untuk SALE, "tr-purchase" untuk PURCHASE)
         * Mencari transaksi terakhir pada hari ini berdasarkan jenis transaksi (SALE/PURCHASE)
         */
        $currentDate = Carbon::now()->format('Y-m-d');
        $prefix = $validated['type'] === 'SALE' ? 'tr-sale' : 'tr-purchase';
        $lastTransaction = Transaction::whereDate('transaction_date', Carbon::today())
            ->where('type', $validated['type'])
            ->latest()
            ->first();

        /** Menentukan nomor urut transaksi hari ini */
        $serialNumber = $lastTransaction ?
            intval(substr($lastTransaction->no_transaction, -3)) + 1 : 1;

        /**
         * Jika ada transaksi terakhir hari ini, ambil 3 digit terakhir sebagai nomor urut, lalu tambahkan 1
         * Jika belum ada transaksi, mulai dari 1
         * Memastikan nomor urut selalu 3 digit dengan menambahkan nol di depan jika perlu
         */
        $serialNumber = str_pad($serialNumber, 3, '0', STR_PAD_LEFT);

        /**
         * Membentuk nomor transaksi dengan format: "tr-sale-YYYY-MM-DD-XXX" atau "tr-purchase-YYYY-MM-DD-XXX"
         */
        $no_transaction = "{$prefix}-{$currentDate}-{$serialNumber}";

        try {
            /** Memulai transaksi database menggunakan DB::transaction */
            DB::transaction(function () use ($validated, $no_transaction, $currentDate) {

                /** Membuat entri baru untuk transaksi utama */
                $transaction = Transaction::create([
                    'type' => $validated['type'],
                    'notes' => $validated['notes'] ?? null,
                    'transaction_date' => $currentDate,
                    'no_transaction' => $no_transaction,
                    'total_amount' => $validated['total_amount'],
                    'user_id' => $validated['user_id'],
                ]);

                /**
                 *  Iterasi setiap produk yang dipilih dalam transaksi
                 */
                foreach ($validated['selectedProducts'] as $product) {

                    /** Menambahkan item transaksi ke tabel TransactionItem */
                    TransactionItem::create([
                        'transaction_id' => $transaction->id,
                        'product_id' => $product['productId'],
                        'quantity' => $product['quantity'],
                        'selling_price' => $product['selling_price']
                    ]);

                    /** Jika transaksi adalah "SALE" (penjualan), stok produk dikurangi */
                    if ($validated['type'] === 'SALE') {
                        $productModel = Product::find($product['productId']);
                        $productModel->decrement('stock', $product['quantity']);
                    }

                    /** Jika transaksi adalah "PURCHASE" (pembelian), stok produk ditambah */
                    if ($validated['type'] === 'PURCHASE') {
                        $productModel = Product::find($product['productId']);
                        $productModel->increment('stock', $product['quantity']);
                    }
                }
            });

            return to_route('transaction.index');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to stored transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $transaction = Transaction::with(['items.product', 'user'])->findOrFail($id);
        return Inertia::render('Transaction/Detail', [
            'transaction' => $transaction
        ]);
    }
}
