<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserInformationsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->optional(0.7)->lastName(),
            'gender' => fake()->optional(0.85)->randomElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
            'birthdate' => fake()->optional(0.8)->dateTimeBetween('-70 years', '-18 years')?->format('Y-m-d'),
            'region' => fake()->optional(0.75)->randomElement([
                'National Capital Region',
                'Central Luzon',
                'Calabarzon',
                'Western Visayas',
                'Central Visayas',
                'Davao Region',
                'Northern Mindanao',
            ]),
            'city' => fake()->optional(0.85)->city(),
            'barangay' => fake()->optional(0.7)->streetName(),
            'address' => fake()->optional(0.85)->streetAddress(),
            'contact_no' => fake()->optional(0.8)->numerify('09#########'),
        ];
    }
}