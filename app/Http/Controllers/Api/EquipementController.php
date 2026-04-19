<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $equipements = Equipement::orderBy('id', 'desc')
            ->paginate(10);

        return response()->json($equipements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'libelle' => 'required|string',
        ]);

        $equipement = Equipement::create($request->only('libelle'));

        return response()->json([
            "message" => "Équipement créé avec succès",
            "data" => $equipement
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $equipement = Equipement::findOrFail($id);

        return response()->json($equipement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $equipement = Equipement::findOrFail($id);

        $request->validate([
            'libelle' => 'required|string',
        ]);

        $equipement->update($request->only('libelle'));

        return response()->json([
            "message" => "Équipement mis à jour",
            "data" => $equipement
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $equipement = Equipement::findOrFail($id);
        $equipement->delete();

        return response()->json([
            "message" => "Équipement supprimé"
        ]);
    }
}
