<?php

use App\Http\Controllers\CashSessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\TransactionController;
use App\Models\Product;
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
    $today = Carbon::today();

    $dailyTransactions = Transaction::selectRaw('DATE(transaction_date) as date,type, SUM(total_amount) as total_amount')
        ->whereDate('transaction_date', $today)
        ->where('status', Transaction::STATUS_COMPLETED)
        ->groupBy('date', 'type')
        ->orderBy('date', 'desc')
        ->get();

    $lowStockProducts = Product::whereColumn('stock', '<=', 'min_stock')
        ->where('min_stock', '>', 0)
        ->where('is_active', true)
        ->orderBy('stock')
        ->take(5)
        ->get(['id', 'name', 'stock', 'min_stock']);

    return Inertia::render('Dashboard', [
        'dailyTransactions' => $dailyTransactions,
        'lowStockProducts' => $lowStockProducts,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('category', CategoryController::class)->middleware('role:admin,manager');
    Route::resource('product', ProductController::class)->middleware('role:admin,manager');
    Route::resource('partner', PartnerController::class)->middleware('role:admin,manager');

    Route::get('/products/last-number/{categoryId}', [ProductController::class, 'getLastProductNumber']);

    Route::resource('transaction', TransactionController::class)->except(['destroy'])
        ->middleware('role:admin,cashier,manager');

    Route::post('transaction/{transaction}/cancel', [TransactionController::class, 'cancel'])
        ->name('transaction.cancel')
        ->middleware('role:admin,manager');

    Route::post('transaction/{transaction}/return', [TransactionController::class, 'markAsReturned'])
        ->name('transaction.return')
        ->middleware('role:admin,manager');

    Route::get('inventory/adjustments', [StockAdjustmentController::class, 'index'])
        ->name('inventory.adjustments.index')
        ->middleware('role:admin,manager');

    Route::post('inventory/adjustments', [StockAdjustmentController::class, 'store'])
        ->name('inventory.adjustments.store')
        ->middleware('role:admin,manager');

    Route::get('cash-sessions', [CashSessionController::class, 'index'])
        ->name('cash-sessions.index')
        ->middleware('role:admin,cashier');

    Route::post('cash-sessions', [CashSessionController::class, 'store'])
        ->name('cash-sessions.store')
        ->middleware('role:admin,cashier');

    Route::post('cash-sessions/{cashSession}/close', [CashSessionController::class, 'close'])
        ->name('cash-sessions.close')
        ->middleware('role:admin,cashier');

    Route::get('sales-report', [ReportController::class, 'salesreport']);
    Route::get('sales-report-chart', [ReportController::class, 'salesreportchart']);
    Route::get('purchases-report', [ReportController::class, 'purchasesreport']);
    Route::get('profit-report', [ReportController::class, 'profitReport']);
    Route::get('inventory-report', [ReportController::class, 'inventoryReport']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
