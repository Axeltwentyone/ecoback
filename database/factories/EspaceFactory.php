<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Espace>
 */
class EspaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->company(),
            'surface' => fake()->numberBetween(20, 200),
            'type' => fake()->randomElement(['bureau', 'salle de réunion', 'conférence']),
            'tarif_jour' => fake()->numberBetween(50, 500),
        ];
    }
}
