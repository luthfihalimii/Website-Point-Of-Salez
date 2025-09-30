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
            'selectedProducts' => 'required|array|min:1',
            'selectedProducts.*.productId' => 'required|exists:products,id',
            'selectedProducts.*.quantity' => 'required|integer|min:1',
            'selectedProducts.*.selling_price' => 'required|numeric|min:0',
            'selectedProducts.*.cost_price' => 'nullable|numeric|min:0',
            'selectedProducts.*.discount_amount' => 'nullable|numeric|min:0',
            'selectedProducts.*.tax_amount' => 'nullable|numeric|min:0',

            'type' => 'required|in:SALE,PURCHASE',
            'notes' => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'total_amount' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|max:100',
            'payment_amount' => 'nullable|numeric|min:0',
            'change_amount' => 'nullable|numeric|min:0',
            'partner_id' => 'nullable|exists:partners,id',
            'user_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'selectedProducts.required' => 'Setidaknya pilih satu produk untuk transaksi.',
            'selectedProducts.*.quantity.min' => 'Jumlah produk minimal 1.',
        ];
    }
}
