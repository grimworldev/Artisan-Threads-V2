<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserInformations;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = UserInformations::with('user:id,username,email,uuid')
            ->where('user_id', '!=', Auth::id())
            ->get();

        return inertia('user/index', [
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
     *
     * This is the public registration endpoint — no auth required.
     * Creates both the User and its UserInformation together.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // users
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],

            // user_informations
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'birthdate' => ['nullable', 'date'],
            'region' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'contact_no' => ['nullable', 'string', 'max:20'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'], // auto-hashed via the model's 'hashed' cast
            ]);

            $user->information()->create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'birthdate' => $validated['birthdate'] ?? null,
                'region' => $validated['region'] ?? null,
                'city' => $validated['city'] ?? null,
                'barangay' => $validated['barangay'] ?? null,
                'address' => $validated['address'] ?? null,
                'contact_no' => $validated['contact_no'] ?? null,
            ]);

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
}