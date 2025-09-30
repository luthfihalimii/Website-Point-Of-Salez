<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockAdjustments()
    {
        return $this->hasMany(StockAdjustment::class);
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value
                ? url('storage/' . $value)
                : 'https://kzmqeof5nva13225mfru.lite.vusercontent.net/placeholder.svg?height=600width=600'
        );
    }
}
