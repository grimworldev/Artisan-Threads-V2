<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            // One shop per user
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->string('business_name');
            $table->text('business_description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('region')->nullable();
            $table->string('city')->nullable();
            $table->string('barangay')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_no')->nullable();
            // e.g. status, 0 = pending, 1 = approved, 2 = suspended
            $table->tinyInteger('status')->default(0); // 0 = pending, 1 = approved, 2 = suspended
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_shop_informations');
    }
};