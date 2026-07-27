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
        Schema::create('shops_products', function (Blueprint $table) {
            $table->id();
            $table->string('uuid', 12)->unique();
            $table->foreignId('shop_id')->constrained('shops');
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('quantity')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
            $table->index(['shop_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops_products');
    }
};