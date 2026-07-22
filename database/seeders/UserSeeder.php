<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'grimworld.dev@gmail.com'], // lookup key — prevents duplicate admins if you re-seed
            [
                'uuid' => Str::uuid(),
                'username' => 'grimworld',
                'password' => Hash::make('password1234'), // change this before deploying
                'role' => 0,     // 0 = admin
                'status' => 1,   // 1 = approved
                'email_verified_at' => now(),
            ]
        );
    }
}