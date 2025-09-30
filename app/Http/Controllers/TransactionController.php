<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Partner;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Transaction/Index', [
            'transaction' => Transaction::with(['items.product', 'user', 'partner'])
                ->latest('transaction_date')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Transaction/Create', [
            'products' => Product::with('category')->where('is_active', true)->get(),
            'partners' => [
                'customers' => Partner::where('type', 'CUSTOMER')->where('is_active', true)->orderBy('name')->get(),
                'suppliers' => Partner::where('type', 'SUPPLIER')->where('is_active', true)->orderBy('name')->get(),
            ],
        ]);
    }

    public function store(TransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $transactionDateInput = $validated['transaction_date'] ?? now();
        $transactionDateTime = Carbon::parse($transactionDateInput);
        $transactionDate = $transactionDateTime->toDateString();
        $prefix = $validated['type'] === 'SALE' ? 'tr-sale' : 'tr-purchase';

        $lastTransaction = Transaction::whereDate('transaction_date', $transactionDate)
            ->where('type', $validated['type'])
            ->latest('no_transaction')
            ->first();

        $serialNumber = $lastTransaction
            ? intval(substr($lastTransaction->no_transaction, -3)) + 1
            : 1;

        $serialNumber = str_pad($serialNumber, 3, '0', STR_PAD_LEFT);
        $noTransaction = "{$prefix}-{$transactionDate}-{$serialNumber}";

        $itemPayloads = [];
        $lineTotals = 0;

        $products = Product::whereIn('id', collect($validated['selectedProducts'])->pluck('productId'))
            ->get()
            ->keyBy('id');

        foreach ($validated['selectedProducts'] as $item) {
            $product = $products[$item['productId']] ?? null;

            if (!$product) {
                abort(422, 'Produk tidak ditemukan.');
            }

            $quantity = (int) $item['quantity'];

            if ($validated['type'] === 'SALE' && $product->stock < $quantity) {
                abort(422, "Stok {$product->name} tidak mencukupi.");
            }

            $unitPrice = (float) $item['selling_price'];
            $costPrice = $validated['type'] === 'SALE'
                ? (float) $product->price
                : (float) ($item['cost_price'] ?? $item['selling_price']);

            $lineDiscount = (float) ($item['discount_amount'] ?? 0);
            $lineTax = (float) ($item['tax_amount'] ?? 0);
            $lineTotal = round(($unitPrice * $quantity) - $lineDiscount + $lineTax, 2);

            $lineTotals += $lineTotal;

            $itemPayloads[] = [
                'product_id' => $product->id,
                'quantity' => $quantity,
                'selling_price' => $unitPrice,
                'price' => $costPrice,
                'discount_amount' => $lineDiscount,
                'tax_amount' => $lineTax,
                'line_total' => $lineTotal,
            ];
        }

        $transactionDiscount = (float) ($validated['discount_amount'] ?? 0);
        $transactionTax = (float) ($validated['tax_amount'] ?? 0);
        $grandTotal = round($lineTotals - $transactionDiscount + $transactionTax, 2);

        if ($validated['type'] === 'SALE') {
            $paymentAmount = (float) ($validated['payment_amount'] ?? 0);

            if ($paymentAmount < $grandTotal) {
                abort(422, 'Jumlah pembayaran kurang dari total transaksi.');
            }
        }

        $paymentChange = max((float) ($validated['payment_amount'] ?? 0) - $grandTotal, 0);
        $paymentMethod = $validated['payment_method'] ?? ($validated['type'] === 'SALE' ? 'CASH' : null);

        try {
            DB::transaction(function () use ($validated, $transactionDate, $transactionDateTime, $noTransaction, $itemPayloads, $grandTotal, $transactionDiscount, $transactionTax, $paymentChange, $paymentMethod) {
                $transaction = Transaction::create([
                    'type' => $validated['type'],
                    'status' => Transaction::STATUS_COMPLETED,
                    'notes' => $validated['notes'] ?? null,
                    'transaction_date' => $transactionDateTime,
                    'no_transaction' => $noTransaction,
                    'total_amount' => $grandTotal,
                    'discount_amount' => $transactionDiscount,
                    'tax_amount' => $transactionTax,
                    'payment_method' => $paymentMethod,
                    'payment_amount' => $validated['payment_amount'] ?? 0,
                    'change_amount' => $paymentChange,
                    'user_id' => $validated['user_id'],
                    'partner_id' => $validated['partner_id'] ?? null,
                ]);

                foreach ($itemPayloads as $payload) {
                    $product = Product::lockForUpdate()->findOrFail($payload['product_id']);

                    TransactionItem::create(array_merge($payload, [
                        'transaction_id' => $transaction->id,
                    ]));

                    if ($transaction->type === 'SALE') {
                        if ($product->stock < $payload['quantity']) {
                            throw ValidationException::withMessages([
                                'selectedProducts' => "Stok untuk {$product->name} tidak mencukupi.",
                            ]);
                        }

                        $product->decrement('stock', $payload['quantity']);
                    }

                    if ($transaction->type === 'PURCHASE') {
                        $product->increment('stock', $payload['quantity']);
                        $product->price = $payload['price'];
                        $product->save();
                    }
                }
            });
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $th) {
            report($th);

            return back()->withErrors(['transaction' => 'Transaksi gagal disimpan.']);
        }

        return to_route('transaction.index');
    }

    public function show(Transaction $transaction): Response
    {
        return Inertia::render('Transaction/Detail', [
            'transaction' => $transaction->load(['items.product', 'user', 'partner']),
        ]);
    }

    public function cancel(Transaction $transaction): RedirectResponse
    {
        if ($transaction->status !== Transaction::STATUS_COMPLETED) {
            return back()->withErrors(['transaction' => 'Transaksi tidak dapat dibatalkan.']);
        }

        $transaction->loadMissing('items');

        DB::transaction(function () use ($transaction) {
            foreach ($transaction->items as $item) {
                $product = Product::lockForUpdate()->findOrFail($item->product_id);

                if ($transaction->type === 'SALE') {
                    $product->increment('stock', $item->quantity);
                }

                if ($transaction->type === 'PURCHASE') {
                    $product->decrement('stock', $item->quantity);
                }
            }

            $transaction->update(['status' => Transaction::STATUS_CANCELED]);
        });

        return back();
    }

    public function markAsReturned(Transaction $transaction): RedirectResponse
    {
        if ($transaction->status !== Transaction::STATUS_COMPLETED) {
            return back()->withErrors(['transaction' => 'Transaksi tidak dapat diretur.']);
        }

        $transaction->loadMissing('items');

        DB::transaction(function () use ($transaction) {
            foreach ($transaction->items as $item) {
                $product = Product::lockForUpdate()->findOrFail($item->product_id);

                if ($transaction->type === 'SALE') {
                    $product->increment('stock', $item->quantity);
                }

                if ($transaction->type === 'PURCHASE') {
                    if ($product->stock < $item->quantity) {
                        abort(422, 'Stok tidak mencukupi untuk retur pembelian.');
                    }
                    $product->decrement('stock', $item->quantity);
                }
            }

            $transaction->update(['status' => Transaction::STATUS_RETURNED]);
        });

        return back();
    }
}
