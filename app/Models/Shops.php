<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Shops extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'business_name',
        'business_description',
        'logo_path',
        'region',
        'city',
        'barangay',
        'address',
        'contact_no',
        'status',
    ];

    protected $appends = ['logo_url'];

    protected function casts(): array
    {
        return [
            'status' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Shops $shop) {
            $shop->uuid ??= (string) Str::uuid();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->logo_path
                ? Storage::disk('public')->url($this->logo_path)
                : null,
        );
    }
}