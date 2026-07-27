<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ShopsProductsImages extends Model
{
    protected $table = 'shops_products_images';

    protected $fillable = [
        'shops_product_id',
        'image_path',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    protected $appends = ['image_url'];

    /**
     * The product this image belongs to.
     */
    public function product()
    {
        return $this->belongsTo(ShopsProducts::class, 'shops_product_id');
    }

    /**
     * Full public URL for the image, derived from its stored path.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? Storage::disk('public')->url($this->image_path)
            : null;
    }
}