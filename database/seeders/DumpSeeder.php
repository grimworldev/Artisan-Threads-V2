<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserInformations;
use Illuminate\Database\Seeder;

class DumpSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()
            ->count(random_int(15, 30))
            ->has(UserInformations::factory(), 'information')
            ->create();
    }
}