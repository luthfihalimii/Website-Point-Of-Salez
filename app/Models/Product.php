<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Fungsi berikut akan mengubah nilai dari kolom image sebelum ditampilkan
     * ke dalam aplikasi. Jika nilai dari kolom image tidak kosong, maka akan mengembalikan URL
     * dari file gambar yang disimpan di dalam storage. Jika nilai dari kolom image kosong, maka
     * akan mengembalikan URL dari placeholder gambar.
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value
            ? url('storage/'.  $value)
            : 'https://kzmqeof5nva13225mfru.lite.vusercontent.net/placeholder.svg?height=600width=600'
        );
    }
}
