<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\admin\CreateAdminRequest;
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

    public function index()
    {
        $query = User::query();

        if ($request->search) {
        $query->where('nom', 'like', '%' . $request->search . '%');
        }

        if ($request->date) {
        $query->whereDate('created_at', $request->date);
        }

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';

        $users = $query->orderBy($sortBy, $sortOrder)->paginate(10);

        return response()->json([
            'message' => 'Liste des utilisateurs',
            'data' => $users,
            'success' => true
        ], 200);
    }
}
