<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_documents', function (Blueprint $table) {
            $table->id();
            // Many documents can belong to one user — no ->unique() here
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('document_type'); // e.g. business_permit, government_id, tax_id
            $table->string('file_path');
            $table->string('original_filename');
            // e.g. status, 0 = pending, 1 = approved, 2 = reject
            $table->tinyInteger('status')->default(0); // 0 = pending, 1 = approved, 2 = rejected
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_documents');
    }
};