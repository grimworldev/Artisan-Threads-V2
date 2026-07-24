<?php

namespace App\Http\Controllers;

use App\Models\Shops;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ShopsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Shops::where('user_id', Auth::id())->exists()) {
            return back()->with('error', 'You have already registered a business.');
        }

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'business_description' => ['required', 'string', 'max:2000'],
            'logo' => ['nullable', 'file', 'mimes:jpeg,jpg,png,svg', 'max:5120'],
            'region' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'string', 'max:20'],
        ]);

        $shop = new Shops($validated);
        $shop->user_id = Auth::id();

        if ($request->hasFile('logo')) {
            $directory = 'users/' . Auth::user()->uuid . '/shop-logos';
            Storage::disk('public')->deleteDirectory($directory);
            $shop->logo_path = $request->file('logo')->store($directory, 'public');
        }

        $shop->save();

        return redirect()
            ->route('profiles.show', Auth::user()->username)
            ->with('success', 'Business registered successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Shops $shops)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shops $shops)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shops $shops)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shops $shops)
    {
        //
    }
}
