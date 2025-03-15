<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'selectedProducts' => 'required|array',
            'selectedProducts.*.productId' => 'required|exists:products,id',
            'selectedProducts.*.quantity' => 'required|integer|min:1',
            'selectedProducts.*.selling_price' => 'required|numeric|min:0',
            'type' => 'required|in:SALE,PURCHASE',
            'notes' => 'nullable|string',
            'transaction_date' => 'date',
            'total_amount' => 'required',
            'user_id' => 'required',
        ];
    }
}
