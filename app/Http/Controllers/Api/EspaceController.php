<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espace;
use Illuminate\Http\Request;

class EspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $espaces = Espace::with('equipements')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json($espaces);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'surface' => 'required|integer',
            'type' => 'required|string',
            'tarif_jour' => 'required|integer',
            'photo' => 'nullable|string',
        ]);

        $espace = Espace::create($request->all());

        return response()->json([
            "message" => "Espace créé avec succès",
            "data" => $espace
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $espace = Espace::with('equipements')->findOrFail($id);

        return response()->json($espace);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $espace = Espace::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string',
            'surface' => 'sometimes|integer',
            'type' => 'sometimes|string',
            'tarif_jour' => 'sometimes|integer',
            'photo' => 'nullable|string',
        ]);

        $espace->update($request->all());

        return response()->json([
            "message" => "Espace mis à jour",
            "data" => $espace
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
    $espace = Espace::findOrFail($id);
        $espace->delete();

        return response()->json([
            "message" => "Espace supprimé"
        ]);
    }
}
