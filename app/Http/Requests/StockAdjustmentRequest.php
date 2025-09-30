<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantity_change' => 'required|integer|not_in:0',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
