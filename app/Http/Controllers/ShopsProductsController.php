<?php

namespace App\Http\Controllers;

use App\Models\Shops;
use App\Models\ShopsProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ShopsProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = ShopsProducts::query()
            ->where('status', ShopsProducts::STATUS_ACTIVE)
            ->latest()
            ->with(['primaryImage', 'shop:id,uuid,business_name'])
            ->get();

        return inertia('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('products/partials/store-product');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => ['required', 'string', 'max:255'],
            'product_description' => ['nullable', 'string', 'max:2000'],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['file', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $shop = Auth::user()->shop; // the business

        $product = $shop->products()->create([
            'product_name' => $validated['product_name'],
            'product_description' => $validated['product_description'] ?? null,
            'category' => $validated['category'] ?? null,
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
        ]);

        if ($request->hasFile('images')) {
            $this->storeProductImages($request, $shop, $product);
        }

        return redirect()
            ->route('shops.show', $shop->uuid)
            ->with('success', 'Product added successfully.');
    }

    /**
     * Add more images to an existing product.
     * Resolved via the product's uuid, not its numeric id.
     */
    public function storeImages(Request $request, ShopsProducts $shopsProduct)
    {
        $request->validate([
            'images' => ['required', 'array', 'max:8'],
            'images.*' => ['file', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $this->storeProductImages($request, $shopsProduct->shop, $shopsProduct);

        return back()->with('success', 'Images added.');
    }

    /**
     * Shared upload logic: builds the path as
     * shops/{shop uuid}/{product uuid}/{product-name-slug}/images/{file}
     */
    protected function storeProductImages(Request $request, $shop, ShopsProducts $product): void
    {
        $slug = Str::slug($product->product_name);
        $directory = "shops/{$shop->uuid}/{$product->uuid}/{$slug}/images";

        $nextSortOrder = $product->images()->max('sort_order') + 1;

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store($directory, 'public');

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => $product->images()->count() === 0 && $index === 0,
                'sort_order' => $nextSortOrder + $index,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Shops $shop, ShopsProducts $product)
    {
        $product->load(['images', 'shop']);

        return inertia('products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShopsProducts $shopsProducts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShopsProducts $shopsProducts)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShopsProducts $shopsProducts)
    {
        //
    }
}
