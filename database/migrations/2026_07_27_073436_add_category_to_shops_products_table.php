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
        Schema::table('shops_products', function (Blueprint $table) {
            Schema::table('shops_products', function (Blueprint $table) {
            $table->string('category')->nullable()->after('product_description');
            $table->index('category');
        });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops_products', function (Blueprint $table) {
            //
        });
    }
};
