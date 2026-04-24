<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\admin\CreateAdminRequest;
use App\Http\Requests\admin\UpdateAdminRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function CreateAdmin(CreateAdminRequest $request)
    {
        $data = $request->validated();

        $admin = User::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'numero' => $data['numero'],
            'adresse_postale' => $data['adresse_postale'],
            'type_de_compte' => 'admin',
        ]);

        return response()->json([
            'message' => 'Admin crée avec succès',
            'admin' => $admin
        ], 201);
    }

    public function index(Request $request)
    {

        $query = User::query();

        if ($request->search) {
        $query->where('nom', 'like', '%' . $request->search . '%');
        }


        $users = $query->with(['reservations' => function($q) {
            $q->with('espace')
                ->latest()
                ->limit(1);
        }])->latest()->paginate(10);

        return response()->json([
            'message' => 'Liste des utilisateurs',
            'data' => $users,
            'success' => true
        ], 200);
    }

    public function update(UpdateAdminRequest $request, User $user)
    {
        $data = $request->validated();

        $user->update([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'numero' => $data['numero'],
            'adresse_postale' => $data['adresse_postale'],
        ]);

        return response()->json([
            'message' => 'Admin mis à jour avec succès',
            'admin' => $user
        ], 200);
    }

    public function show(User $user)
    {
        return response()->json([
            'message' => 'Détails de l\'utilisateur',
            'data' => new UserResource($user->load(['reservations.espace'])),
            'success' => true
        ], 200);
    }

     public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès',
            'success' => true
        ], 200);
    }

     public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->trashed()) {
            $user->restore();

            return response()->json([
                'message' => 'Utilisateur restauré avec succès',
                'success' => true
            ], 200);
        }

        return response()->json([
            'message' => 'L\'utilisateur n\'est pas supprimé',
            'success' => false
        ], 400);
    }

     public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($user->trashed()) {
            $user->forceDelete();

            return response()->json([
                'message' => 'Utilisateur supprimé définitivement avec succès',
                'success' => true
            ], 200);
        }

        return response()->json([
            'message' => 'L\'utilisateur n\'est pas supprimé',
            'success' => false
        ], 400);
    }
}
