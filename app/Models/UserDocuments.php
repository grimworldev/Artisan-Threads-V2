<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocuments extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'file_path_2',
        'original_filename',
        'original_filename_2',
        'status',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}