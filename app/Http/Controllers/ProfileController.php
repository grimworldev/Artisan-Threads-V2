<?php

namespace App\Http\Controllers;

use App\Models\Shops;
use App\Models\User;
use App\Models\UserDocuments;
use App\Models\UserInformations;
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
        $users = UserInformations::with('user:id,username,email,uuid')
            ->where('user_id', '!=', Auth::id())
            ->get();

        return inertia('profile/profiles', [
            'user' => $users,
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
        if (Auth::check() && Auth::user()->username === $uuid) {
            $user = Auth::user()->load([
                'information',
                'shop.products' => fn($query) => $query->where('status', '!=', \App\Models\ShopsProducts::STATUS_REMOVED),
                'shop.products.primaryImage',
                'documents',
            ]);

            return inertia('profile/index', [
                'user' => $user,
            ]);
        }

        $user = User::where('username', $uuid)
            ->with([
                'information',
                'shop.products' => fn($query) => $query->where('status', \App\Models\ShopsProducts::STATUS_ACTIVE),
                'shop.products.primaryImage',
            ])
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
    public function update(Request $request, $id)
    {
        // Only the owner can update their own profile information.
        // (Swap for a Policy/Gate if you want this centralized.)
        if ((int) $request->user()->id !== (int) $id) {
            abort(403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $id],
            'gender' => ['nullable', 'string'],
            'birthdate' => ['nullable', 'date'],
            'contact_no' => ['nullable', 'string', 'max:32'],
            'address' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
        ]);

        // Treat empty strings as "cleared" -> store as null instead of ''
        $validated = collect($validated)
            ->map(fn($value) => $value === '' ? null : $value)
            ->all();

        // Email lives on the user itself
        $user->update(['email' => $validated['email']]);
        unset($validated['email']);

        // Adjust the relation name below if yours differs (e.g. userInformation())
        $user->information()->updateOrCreate(
            ['user_id' => $user->id],
            $validated,
        );

        return back()->with('success', 'Profile information updated.');
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

    /**
     * Rendering the /profiles/business/registration and all.
     */
    public function businessCreate($username)
    {
        if (!Auth::check() || Auth::user()->username !== $username) {
            abort(404);
        }

        // Already has a shop registered — nothing to create here.
        $hasShop = Shops::where('user_id', Auth::id())->exists();

        if ($hasShop) {
            abort(404);
        }

        return inertia('profile/partials/business-registration');
    }
    public function documentCreate($username)
    {
        if (!Auth::check() || Auth::user()->username !== $username) {
            abort(404);
        }

        // Already verified (status 1) — no need to submit documents again.
        $isVerified = UserDocuments::where('user_id', Auth::id())
            ->where('status', 1)
            ->exists();

        if ($isVerified) {
            abort(404);
        }

        return inertia('profile/partials/profile-verification');
    }
}