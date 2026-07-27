<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ShopsProducts extends Model
{
    // Status constants — use these instead of raw numbers in your code
    const STATUS_REMOVED = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_OUT_OF_STOCK = 2;

    protected $fillable = [
        'shop_id',
        'product_name',
        'product_description',
        'category',
        'price',
        'quantity',
        'status',
    ];

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
    ];

    /**
     * Use uuid instead of id for route-model binding.
     * e.g. Route::get('shops-products/{shopsProduct}', ...) resolves via uuid.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->uuid)) {
                $product->uuid = static::generateUniqueUuid();
            }
        });
    }

    protected static function generateUniqueUuid(): string
    {
        do {
            $uuid = Str::random(10);
        } while (static::where('uuid', $uuid)->exists());

        return $uuid;
    }

    public function shop()
    {
        return $this->belongsTo(Shops::class, 'shop_id');
    }

    public function images()
    {
        return $this->hasMany(ShopsProductsImages::class, 'shops_product_id')
            ->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ShopsProductsImages::class, 'shops_product_id')
            ->where('is_primary', true);
    }

    public function setPrimaryImage(ShopsProductsImages $image): void
    {
        $this->images()->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);
    }
}