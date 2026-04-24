<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Espace;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(string $role = 'client'): User
    {
        return User::create([
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'marie@test.com',
            'password' => Hash::make('123456'),
            'numero' => '0612345678',
            'adresse_postale' => '12 rue de Paris',
            'type_de_compte' => $role,
        ]);
    }

    private function createEspace(): Espace
    {
        return Espace::create([
            'nom' => 'Salle A',
            'surface' => 30,
            'type' => 'salle_de_reunion',
            'tarif_jour' => 100,
        ]);
    }

    private function createReservation(int $userId, int $espaceId): Reservation
    {
        return Reservation::create([
            'user_id' => $userId,
            'espace_id' => $espaceId,
            'date_debut' => '2026-05-01',
            'date_fin' => '2026-05-03',
            'prix' => 200,
            'facture_acquittee' => false,
            'statut' => 'en_attente',
        ]);
    }

    public function test_user_peut_creer_une_reservation(): void
    {
        $user = $this->createUser();
        $espace = $this->createEspace();

        $response = $this->actingAs($user)->postJson('/api/reservations', [
            'espace_id' => $espace->id,
            'date_debut' => '2026-05-01',
            'date_fin' => '2026-05-03',
            'statut' => 'en_attente',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => ['id', 'date_debut', 'date_fin', 'prix']
                 ]);
    }

    public function test_user_voit_ses_reservations(): void
    {
        $user = $this->createUser();
        $espace = $this->createEspace();

        $this->createReservation($user->id, $espace->id);

        $response = $this->actingAs($user)->getJson('/api/Mes-reservations');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_user_ne_peut_pas_voir_reservation_dun_autre(): void
    {
        $user1 = $this->createUser();
        $user2 = User::create([
            'nom' => 'Martin',
            'prenom' => 'Pierre',
            'email' => 'pierre@test.com',
            'password' => Hash::make('123456'),
            'numero' => '0612345679',
            'adresse_postale' => '15 rue de Lyon',
            'type_de_compte' => 'client',
        ]);
        $espace = $this->createEspace();

        $reservation = $this->createReservation($user2->id, $espace->id);

        $response = $this->actingAs($user1)->getJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(403);
    }

    public function test_user_peut_supprimer_sa_reservation(): void
    {
        $user = $this->createUser();
        $espace = $this->createEspace();

        $reservation = $this->createReservation($user->id, $espace->id);

        $response = $this->actingAs($user)->deleteJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(200);
    }

    public function test_admin_voit_toutes_les_reservations(): void
    {
        $admin = $this->createUser('admin');
        $espace = $this->createEspace();

        $this->createReservation($admin->id, $espace->id);

        $response = $this->actingAs($admin)->getJson('/api/reservations');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }
}
