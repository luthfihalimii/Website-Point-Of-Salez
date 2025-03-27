<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    //Mendapatkan tanggal hari ini menggunakan Carbon
    $today = Carbon::today();

    // Query untuk mengambil transaksi harian yang dikelompokkan berdasarkan tipe transaksi dan tanggal
    $dailyTransactions = Transaction::selectRaw('DATE(transaction_date) as date,type, SUM(total_amount) as total_amount')
        ->whereDate("transaction_date", $today) // Filter transaksi hanya untuk hari ini
        ->groupBy('date', 'type') // Kelompokkan berdasarkan tanggal dan tipe transaksi
        ->orderBy('date', 'desc') // Urutkan berdasarkan tanggal secara descending
        ->get();

    return Inertia::render('Dashboard',[
        'dailyTransactions' => $dailyTransactions
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::resource('category', (CategoryController::class));
    Route::resource('product', (ProductController::class));
    Route::get('/products/last-number/{categoryId}', [ProductController::class, 'getLastProductNumber']);

    Route::resource('transaction', (TransactionController::class));

    Route::get('sales-report', [ReportController::class, 'salesreport']);
    Route::get('sales-report-chart', [ReportController::class, 'salesreportchart']);
    Route::get('purchases-report', [ReportController::class, 'purchasesreport']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
