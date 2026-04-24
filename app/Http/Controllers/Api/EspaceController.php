<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espace;
use App\Http\Requests\espace\StoreEspaceRequest;
use App\Http\Requests\espace\UpdateEspaceRequest;
use Illuminate\Http\Request;
use App\Http\Resources\EspaceResource;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;



class EspaceController extends Controller
{
    /**
     * Helper pour convertir et enregistrer une image en WebP
     */
    private function storeWebp($file)
    {
        $manager = new ImageManager(new Driver());
        $name = time() . '_' . uniqid() . '.webp';
        $path = 'espaces/' . $name;
        
        $image = $manager->read($file);
        $encoded = $image->toWebp(80);
        
        Storage::disk('public')->put($path, (string) $encoded);
        
        return $path;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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
           'data' => EspaceResource::collection($espaces),
            'success' => true
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEspaceRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $this->storeWebp($request->file('photo'));
        }

        $espace = Espace::create([
            'nom'        => $data['nom'],
            'surface'    => $data['surface'],
            'type'       => $data['type'],
            'tarif_jour' => $data['tarif_jour'],
            'photo'      => $data['photo'] ?? null,
        ]);

        if (isset($data['equipements'])) {
            $espace->equipements()->sync($data['equipements']);
        }

        return response()->json([
            'message' => 'Espace créé avec succès',
            'data'    => new EspaceResource($espace->load(['equipements', 'reservations'])),
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
            'data'    => new EspaceResource($espace->load(['equipements', 'reservations'])),
            'success' => true
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEspaceRequest $request, Espace $espace)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($espace->photo) {
                Storage::disk('public')->delete($espace->photo);
            }
            $data['photo'] = $this->storeWebp($request->file('photo'));
        }

        $espace->update([
            'nom'        => $data['nom']        ?? $espace->nom,
            'surface'    => $data['surface']    ?? $espace->surface,
            'type'       => $data['type']       ?? $espace->type,
            'tarif_jour' => $data['tarif_jour'] ?? $espace->tarif_jour,
            'photo'      => $data['photo']      ?? $espace->photo,
        ]);

        if (isset($data['equipements'])) {
            $espace->equipements()->sync($data['equipements']);
        }

        return response()->json([
            'message' => 'Espace mis à jour avec succès',
            'data'    => new EspaceResource($espace->load(['equipements', 'reservations'])),
            'success' => true
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Espace $espace)
    {
        if ($espace->photo) {
            Storage::disk('public')->delete($espace->photo);
        }
        
        $espace->delete();

        return response()->json([
            'message' => 'Espace supprimé avec succès',
            'success' => true
        ], 200);
    }
}
