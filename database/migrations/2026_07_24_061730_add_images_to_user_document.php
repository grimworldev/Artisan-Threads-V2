<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_documents', function (Blueprint $table) {
            $table->string('file_path_2')->nullable()->after('file_path');
            $table->string('original_filename_2')->nullable()->after('original_filename');
        });
    }

    public function down(): void
    {
        Schema::table('user_documents', function (Blueprint $table) {
            $table->dropColumn(['file_path_2', 'original_filename_2']);
        });
    }
};