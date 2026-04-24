<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_echoue_mauvais_mot_de_passe(): void
    {

        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('123456'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'pin' => 'mauvais_mot_de_passe',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_reussi(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('123456'),
        ]);


        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'pin' => '123456',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'access_token',
                     'user'
                 ]);
    }

    public function test_acces_reservations_sans_token(): void
    {
        $response = $this->getJson('/api/reservations');

        $response->assertStatus(401);
    }

    public function test_user_peut_creer_une_reservation(): void
    {
        $user = User::factory()->create();
        $espace = \App\Models\Espace::factory()->create([
            'tarif_jour' => 100,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => '2026-05-01',
                'date_fin' => '2026-05-03',
            ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'date_debut',
                        'date_fin',
                        'prix',
                    ]
                ]);
    }

    public function test_on_ne_peut_pas_reserver_un_espace_deja_pris(): void
    {
        $user = User::factory()->create();
        $espace = \App\Models\Espace::factory()->create();

        // 1. Première réservation (23 au 30 avril)
        \App\Models\Reservation::create([
            'espace_id' => $espace->id,
            'user_id' => $user->id,
            'date_debut' => '2026-04-23',
            'date_fin' => '2026-04-30',
            'prix' => 100,
            'statut' => 'en_attente',
            'facture_acquittee' => true,
        ]);

        // 2. Tentative de réservation chevauchante (29 au 30 avril)
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => '2026-04-29',
                'date_fin' => '2026-04-30',
            ]);

        // 3. Doit échouer avec une erreur 422
        $response->assertStatus(422)
                 ->assertJson([
                     'message' => 'Cet espace est déjà réservé pour ces dates.',
                 ]);
    }
}
