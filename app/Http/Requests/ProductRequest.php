<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ProductRequest extends FormRequest
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
            'product_code' => 'required',
            'name' => 'required|min:3',
            'slug' => 'required',
            'stock' => 'required|min:1|numeric',
            'price' => 'required|min:1|numeric',
            'selling_price' => 'required|min:1|numeric',
            'image' => 'nullable|mimes:png,jpg,jpeg',
            'description' => 'required|min:4',
            'category_id' => 'required|numeric'
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => $this->slug ? : Str::slug($this->name)
        ]);
    }
}
