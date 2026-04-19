<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\admin\RegisterRequest;
use App\Http\Requests\admin\LoginRequest;
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
            'password' => Hash::make($data['password']),
            'numero' => $data['numero'],
            'adresse_postale' => $data['adresse_postale'],
            'type_de_compte' => 'client',
        ]);

        return response()->json([
            'message' => 'Client crée avec succès',
            'user' => $user
        ], 201);

    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();


       $user = User::where('email', $data['email'])->first();

       if (!$user || !Hash::check($data['password'], $user->password)) {
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
}
