<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_informations', function (Blueprint $table) {
            $table->id();
            // One-to-one link back to users.id (the auto-increment PK, not the uuid)
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('gender')->nullable();
            $table->date('birthdate')->nullable();
            // PH address structure
            $table->string('region')->nullable();
            $table->string('city')->nullable();
            $table->string('barangay')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_no')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_informations');
    }
};