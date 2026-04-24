<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{

    use RefreshDatabase;

    public function test_user_peut_sinscrire(): void
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'marie@test.com',
            'pin' => '123456',
            'pin_confirmation' => '123456',
            'numero' => '0612345678',
            'adresse_postale' => '12 rue de Paris',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'access_token',
                     'user' => ['id', 'nom', 'prenom', 'email']
                 ]);
    }


    public function test_user_peut_se_connecter(): void
    {
        $user = User::create([
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'marie@test.com',
            'password' => Hash::make('123456'),
            'numero' => '0612345678',
            'adresse_postale' => '12 rue de Paris',
            'type_de_compte' => 'client',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'marie@test.com',
            'pin' => '123456',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'access_token',
                     'user' => ['id', 'nom', 'email']
                 ]);
    }


    public function test_login_avec_mauvais_pin(): void
    {
        User::create([
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'marie@test.com',
            'password' => Hash::make('123456'),
            'numero' => '0612345678',
            'adresse_postale' => '12 rue de Paris',
            'type_de_compte' => 'client',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'marie@test.com',
            'pin' => '999999', // mauvais pin
        ]);

        $response->assertStatus(401);
    }


    public function test_login_avec_email_inexistant(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'inconnu@test.com',
            'pin' => '123456',
        ]);

        $response->assertStatus(401);
    }

    
    public function test_user_peut_se_deconnecter(): void
    {
        $user = User::create([
            'nom' => 'Dupont',
            'prenom' => 'Marie',
            'email' => 'marie@test.com',
            'password' => Hash::make('123456'),
            'numero' => '0612345678',
            'adresse_postale' => '12 rue de Paris',
            'type_de_compte' => 'client',
        ]);

        // On simule un user connecté avec Sanctum
        $response = $this->actingAs($user)->postJson('/api/logout');

        $response->assertStatus(200);
    }
}
