<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $partnerId = $this->route('partner')?->id ?? $this->route('partner');

        return [
            'type' => 'required|in:CUSTOMER,SUPPLIER',
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255|unique:partners,email,' . $partnerId,
            'address' => 'nullable|string',
            'tax_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
