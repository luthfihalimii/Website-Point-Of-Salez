<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockAdjustment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockAdjustmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inventory/Adjustments', [
            'adjustments' => StockAdjustment::with(['product', 'user'])
                ->latest()
                ->paginate(20)
                ->through(fn ($adjustment) => [
                    'id' => $adjustment->id,
                    'product' => $adjustment->product->only(['id', 'name', 'product_code']),
                    'user' => $adjustment->user->only(['id', 'name']),
                    'quantity_change' => $adjustment->quantity_change,
                    'reason' => $adjustment->reason,
                    'notes' => $adjustment->notes,
                    'created_at' => $adjustment->created_at,
                ]),
            'products' => Product::orderBy('name')->get(['id', 'name', 'product_code', 'stock']),
        ]);
    }

    public function store(StockAdjustmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $userId = $request->user()->id;

        DB::transaction(function () use ($data, $userId) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);

            $product->stock += $data['quantity_change'];
            $product->save();

            StockAdjustment::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'quantity_change' => $data['quantity_change'],
                'reason' => $data['reason'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);
        });

        return back();
    }
}
