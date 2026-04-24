<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Espace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class EspaceTest extends TestCase
{
    use RefreshDatabase;

    // Créer un user helper pour ne pas répéter le code
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

    /**
     * Test 1 — Un user connecté peut voir la liste des espaces
     */
    public function test_user_peut_voir_liste_espaces(): void
    {
        $user = $this->createUser();
        $this->createEspace();

        $response = $this->actingAs($user)->getJson('/api/espaces');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [['id', 'nom', 'surface', 'type', 'tarif_jour']]
                 ]);
    }

    /**
     * Test 2 — Un user connecté peut voir le détail d'un espace
     */
    public function test_user_peut_voir_detail_espace(): void
    {
        $user = $this->createUser();
        $espace = $this->createEspace();

        $response = $this->actingAs($user)->getJson("/api/espaces/{$espace->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['nom' => 'Salle A']);
    }

    /**
     * Test 3 — Un admin peut créer un espace
     */
    public function test_admin_peut_creer_espace(): void
    {
        $admin = $this->createUser('admin');

        $response = $this->actingAs($admin)->postJson('/api/espaces', [
            'nom' => 'Salle B',
            'surface' => 50,
            'type' => 'conference',
            'tarif_jour' => 200,
            'photo' => \Illuminate\Http\UploadedFile::fake()->image('exemple.png')
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['nom' => 'Salle B']);
    }

    /**
     * Test 4 — Un user non admin ne peut pas créer un espace
     * Résultat attendu : 403
     */
    public function test_user_ne_peut_pas_creer_espace(): void
    {
        $user = $this->createUser('client');

        $response = $this->actingAs($user)->postJson('/api/espaces', [
            'nom' => 'Salle C',
            'surface' => 20,
            'type' => 'bureau',
            'tarif_jour' => 50,
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test 5 — Un admin peut supprimer un espace
     */
    public function test_admin_peut_supprimer_espace(): void
    {
        $admin = $this->createUser('admin');
        $espace = $this->createEspace();

        $response = $this->actingAs($admin)->deleteJson("/api/espaces/{$espace->id}");

        $response->assertStatus(200);
    }
}
