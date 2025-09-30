<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'transaction_date' => 'datetime',
        'payment_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public const STATUS_COMPLETED = 'COMPLETED';
    public const STATUS_CANCELED = 'CANCELED';
    public const STATUS_RETURNED = 'RETURNED';

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function scopeSales($query)
    {
        return $query->where('type', 'SALE');
    }

    public function scopePurchases($query)
    {
        return $query->where('type', 'PURCHASE');
    }
}
