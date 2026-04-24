<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipement;
use App\Http\Requests\equipement\StoreEquipementRequest;
use App\Http\Requests\equipement\UpdateEquipementRequest;
use Illuminate\Http\Request;
use App\Http\Resources\EquipementResource;

class EquipementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Equipement::query();

        if ($request->libelle) {
            $query->where('libelle', 'like', '%' . $request->libelle . '%');
        }

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';

        $equipements = $query->orderBy($sortBy, $sortOrder)
                             ->paginate(10);

        return response()->json([
            'message' => 'Liste des équipements',
            'data' => EquipementResource::collection($equipements),
            'success' => true
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipementRequest $request)
    {
        $data = $request->validated();

        $equipement = Equipement::create([
            'libelle' => $data['libelle'],
        ]);

        return response()->json([
            'message' => 'Équipement créé avec succès',
            'data'    => new EquipementResource($equipement),
            'success' => true
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipement $equipement)
    {
        return response()->json([
            'message' => 'Détails de l\'équipement',
            'data'    => $equipement,
            'success' => true
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        $data = $request->validated();

        $equipement->update([
            'libelle' => $data['libelle'] ?? $equipement->libelle,
        ]);

        return response()->json([
            'message' => 'Équipement mis à jour avec succès',
            'data'    => new EquipementResource($equipement),
            'success' => true
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipement $equipement)
    {
        $equipement->delete();

        return response()->json([
            'message' => 'Équipement supprimé avec succès',
            'success' => true
        ], 200);
    }
}
