<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'slug',
        'contact_person',
        'phone',
        'email',
        'address',
        'tax_number',
        'notes',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $partner) {
            if (empty($partner->slug)) {
                $partner->slug = Str::slug($partner->name . '-' . Str::random(4));
            }
        });

        static::updating(function (self $partner) {
            if ($partner->isDirty('name')) {
                $partner->slug = Str::slug($partner->name . '-' . Str::random(4));
            }
        });
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
