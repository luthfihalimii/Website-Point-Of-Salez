<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CloseCashSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'closing_balance' => 'required|numeric|min:0',
            'cash_sales_total' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
