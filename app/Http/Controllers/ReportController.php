<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockAdjustment;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function salesreport(Request $request): Response
    {
        [$from, $to] = $this->resolveRange($request);

        $transactions = Transaction::with(['items.product', 'user', 'partner'])
            ->where('type', 'SALE')
            ->where('status', Transaction::STATUS_COMPLETED)
            ->whereBetween('transaction_date', [$from, $to])
            ->when($request->filled('user_id'), fn ($query) => $query->where('user_id', $request->input('user_id')))
            ->when($request->filled('partner_id'), fn ($query) => $query->where('partner_id', $request->input('partner_id')))
            ->orderBy('transaction_date')
            ->get();

        $summary = [
            'gross' => $transactions->sum('total_amount'),
            'discount' => $transactions->sum('discount_amount'),
            'tax' => $transactions->sum('tax_amount'),
            'net' => $transactions->sum(fn ($transaction) => $transaction->total_amount - $transaction->discount_amount + $transaction->tax_amount),
        ];

        return Inertia::render('Report/SalesReport', [
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
                'user_id' => $request->input('user_id'),
                'partner_id' => $request->input('partner_id'),
            ],
        ]);
    }

    public function salesreportchart(Request $request): Response
    {
        [$from, $to] = $this->resolveRange($request);

        $chart = Transaction::selectRaw('DATE(transaction_date) as date, SUM(total_amount - discount_amount + tax_amount) as net_total')
            ->where('type', 'SALE')
            ->where('status', Transaction::STATUS_COMPLETED)
            ->whereBetween('transaction_date', [$from, $to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Report/SalesReportChart', [
            'chart' => $chart,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }

    public function purchasesreport(Request $request): Response
    {
        [$from, $to] = $this->resolveRange($request);

        $transactions = Transaction::with(['items.product', 'user', 'partner'])
            ->where('type', 'PURCHASE')
            ->where('status', Transaction::STATUS_COMPLETED)
            ->whereBetween('transaction_date', [$from, $to])
            ->when($request->filled('partner_id'), fn ($query) => $query->where('partner_id', $request->input('partner_id')))
            ->orderBy('transaction_date')
            ->get();

        $summary = [
            'total_purchases' => $transactions->sum('total_amount'),
        ];

        return Inertia::render('Report/PurchasesReport', [
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
                'partner_id' => $request->input('partner_id'),
            ],
        ]);
    }

    public function profitReport(Request $request): Response
    {
        [$from, $to] = $this->resolveRange($request);

        $profitRows = TransactionItem::query()
            ->selectRaw('DATE(transactions.transaction_date) as date')
            ->selectRaw("SUM(CASE WHEN transactions.type = 'SALE' THEN transaction_items.line_total ELSE 0 END) as revenue")
            ->selectRaw("SUM(CASE WHEN transactions.type = 'SALE' THEN transaction_items.price * transaction_items.quantity ELSE 0 END) as cost_of_goods")
            ->selectRaw("SUM(CASE WHEN transactions.type = 'PURCHASE' THEN transaction_items.line_total ELSE 0 END) as purchase_spending")
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->whereBetween('transactions.transaction_date', [$from, $to])
            ->where('transactions.status', Transaction::STATUS_COMPLETED)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $profitRows->transform(function ($row) {
            $row->revenue = (float) ($row->revenue ?? 0);
            $row->cost_of_goods = (float) ($row->cost_of_goods ?? 0);
            $row->purchase_spending = (float) ($row->purchase_spending ?? 0);
            $row->gross_profit = $row->revenue - $row->cost_of_goods;
            $row->net_profit = $row->gross_profit - $row->purchase_spending;
            return $row;
        });

        $summary = [
            'revenue' => $profitRows->sum('revenue'),
            'cost_of_goods' => $profitRows->sum('cost_of_goods'),
            'purchase_spending' => $profitRows->sum('purchase_spending'),
            'gross_profit' => $profitRows->sum('gross_profit'),
            'net_profit' => $profitRows->sum('net_profit'),
        ];

        return Inertia::render('Report/ProfitReport', [
            'rows' => $profitRows,
            'summary' => $summary,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }

    public function inventoryReport(Request $request): Response
    {
        [$from, $to] = $this->resolveRange($request);

        $movement = TransactionItem::query()
            ->select('products.id', 'products.name')
            ->selectRaw("SUM(CASE WHEN transactions.type = 'SALE' THEN transaction_items.quantity ELSE 0 END) as stock_out")
            ->selectRaw("SUM(CASE WHEN transactions.type = 'PURCHASE' THEN transaction_items.quantity ELSE 0 END) as stock_in")
            ->join('transactions', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->join('products', 'products.id', '=', 'transaction_items.product_id')
            ->where('transactions.status', Transaction::STATUS_COMPLETED)
            ->whereBetween('transactions.transaction_date', [$from, $to])
            ->groupBy('products.id', 'products.name')
            ->orderBy('products.name')
            ->get()
            ->map(function ($row) {
                $row->stock_in = (int) $row->stock_in;
                $row->stock_out = (int) $row->stock_out;
                return $row;
            });

        $adjustments = StockAdjustment::with('product')
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('created_at')
            ->take(20)
            ->get();

        $lowStockProducts = Product::whereColumn('stock', '<=', 'min_stock')
            ->where('min_stock', '>', 0)
            ->where('is_active', true)
            ->orderBy('stock')
            ->get(['id', 'name', 'stock', 'min_stock']);

        return Inertia::render('Report/InventoryReport', [
            'movement' => $movement,
            'adjustments' => $adjustments,
            'lowStockProducts' => $lowStockProducts,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }

    private function resolveRange(Request $request): array
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : now()->subMonth();

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : now();

        return [$from->startOfDay(), $to->endOfDay()];
    }
}
