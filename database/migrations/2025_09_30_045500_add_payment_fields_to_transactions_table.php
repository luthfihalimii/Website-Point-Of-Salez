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
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('status', ['COMPLETED', 'CANCELED', 'RETURNED'])->default('COMPLETED')->after('type');
            $table->unsignedBigInteger('partner_id')->nullable()->after('user_id');
            $table->string('payment_method')->nullable()->after('partner_id');
            $table->decimal('payment_amount', 15, 2)->default(0)->after('payment_method');
            $table->decimal('change_amount', 15, 2)->default(0)->after('payment_amount');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('total_amount');
            $table->decimal('tax_amount', 15, 2)->default(0)->after('discount_amount');

            $table->foreign('partner_id')
                ->references('id')
                ->on('partners')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['partner_id']);
            $table->dropColumn([
                'status',
                'partner_id',
                'payment_method',
                'payment_amount',
                'change_amount',
                'discount_amount',
                'tax_amount',
            ]);
        });
    }
};
