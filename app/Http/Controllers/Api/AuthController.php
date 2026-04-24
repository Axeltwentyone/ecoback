<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => Hash::make($data['pin']),
            'numero' => $data['numero'],
            'adresse_postale' => $data['adresse_postale'],
            'type_de_compte' => 'client',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()->json([
            'message' => 'Client crée avec succès',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);

    }

    public function login(LoginRequest $request)
    {

    $data = $request->validated();


       $user = User::where('email', $data['email'])->first();

       if (!$user || !Hash::check($data['pin'], $user->password)) {
        return response()->json([
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
        'message' => 'Connexion réussie',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ], 200);
    }

    public function logout(Request $request)
{
    $user = $request->user();

    if (method_exists($user->currentAccessToken(), 'delete')) {
        $user->currentAccessToken()->delete();
    }

    return response()->json([
        'message' => 'Déconnexion réussie'
    ], 200);
}
}
