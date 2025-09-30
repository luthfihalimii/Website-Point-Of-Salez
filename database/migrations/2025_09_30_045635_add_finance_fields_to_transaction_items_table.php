<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transaction_items', function (Blueprint $table) {
            $table->decimal('discount_amount', 15, 2)->default(0)->after('selling_price');
            $table->decimal('tax_amount', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('line_total', 15, 2)->default(0)->after('tax_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_items', function (Blueprint $table) {
            $table->dropColumn(['discount_amount', 'tax_amount', 'line_total']);
        });
    }
};
