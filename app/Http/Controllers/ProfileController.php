<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user()->load([
            'information',
            // 'documents', // uncomment once the UserDocument relation exists on User
            // 'shops',     // uncomment once the Shop relation exists on User
        ]);

        return inertia('profile/index', [
            'user' => $user,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid)
    {
        $user = User::where('username', $uuid)
            ->with('information')
            ->firstOrFail();

        return inertia('profile/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Upload / replace the authenticated user's profile photo.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'file', 'mimes:jpeg,jpg,png,svg', 'max:5120'], // 5MB
        ]);

        $user = Auth::user();
        $directory = "users/{$user->uuid}/profile-photos";

        // Wipe out whatever was there before storing the new one
        Storage::disk('public')->deleteDirectory($directory);

        $path = $request->file('avatar')->store($directory, 'public');

        $user->update(['avatar_path' => $path]);

        return back()->with('success', 'Profile photo updated.');
    }

    /**
     * Upload / replace the authenticated user's cover photo.
     */
    public function uploadCover(Request $request)
    {
        $request->validate([
            'cover' => ['required', 'file', 'mimes:jpeg,jpg,png,svg', 'max:8192'], // 8MB
        ]);

        $user = Auth::user();
        $directory = "users/{$user->uuid}/cover-photos";

        Storage::disk('public')->deleteDirectory($directory);

        $path = $request->file('cover')->store($directory, 'public');

        $user->update(['cover_path' => $path]);

        return back()->with('success', 'Cover photo updated.');
    }

    /**
     * Remove the authenticated user's cover photo.
     */
    public function destroyCover()
    {
        $user = Auth::user();
        $directory = "users/{$user->uuid}/cover-photos";

        Storage::disk('public')->deleteDirectory($directory);

        $user->update(['cover_path' => null]);

        return back()->with('success', 'Cover photo removed.');
    }
}