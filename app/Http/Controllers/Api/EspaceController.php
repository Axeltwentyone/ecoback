<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espace;
use App\Http\Requests\espace\StoreEspaceRequest;
use App\Http\Requests\espace\UpdateEspaceRequest;
use Illuminate\Http\Request;

class EspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $this->authorize('viewAny', Espace::class);

        $query = Espace::with('equipements');

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->tarif_min && $request->tarif_max) {
            $query->whereBetween('tarif_jour', [
                $request->tarif_min,
                $request->tarif_max
            ]);
        }

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';

        $espaces = $query->orderBy($sortBy, $sortOrder)
                         ->paginate(10);

        return response()->json([
            'message' => 'Liste des espaces',
            'data'    => $espaces,
            'success' => true
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEspaceRequest $request)
    {

        $data = $request->validated();

        $espace = Espace::create([
            'nom'        => $data['nom'],
            'surface'    => $data['surface'],
            'type'       => $data['type'],
            'tarif_jour' => $data['tarif_jour'],
            'photo'      => $data['photo'] ?? null,
        ]);

        return response()->json([
            'message' => 'Espace créé avec succès',
            'data'    => $espace,
            'success' => true
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Espace $espace)
    {
        return response()->json([
            'message' => 'Détails de l\'espace',
            'data'    => $espace->load('equipements'),
            'success' => true
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEspaceRequest $request, Espace $espace)
    {
        $data = $request->validated();

        $espace->update([
            'nom'        => $data['nom']        ?? $espace->nom,
            'surface'    => $data['surface']    ?? $espace->surface,
            'type'       => $data['type']       ?? $espace->type,
            'tarif_jour' => $data['tarif_jour'] ?? $espace->tarif_jour,
            'photo'      => $data['photo']      ?? $espace->photo,
        ]);

        return response()->json([
            'message' => 'Espace mis à jour avec succès',
            'data'    => $espace,
            'success' => true
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Espace $espace)
    {
        $espace->delete();

        return response()->json([
            'message' => 'Espace supprimé avec succès',
            'success' => true
        ], 200);
    }
}
