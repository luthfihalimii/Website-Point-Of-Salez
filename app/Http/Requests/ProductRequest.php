<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_code' => 'required|string|max:100',
            'name' => 'required|string|min:3|max:255',
            'slug' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|mimes:png,jpg,jpeg',
            'description' => 'required|string|min:4',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => $this->slug ?: Str::slug($this->name),
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
