<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\reservation\StoreReservationRequest;
use App\Http\Requests\reservation\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Espace;
use Illuminate\Support\Facades\Auth;


use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservation::query();

        if($request->search){
            $query->whereHas('user', function($q) use ($request){
                $q->where('nom', 'like', '%'.$request->search.'%')
                  ->orWhere('prenom', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->date) {
            $query->whereDate('date_debut', $request->date);
        }

        if ($request->date_debut && $request->date_fin) {
            $query->whereBetween('date_debut', [
                $request->date_debut,
                $request->date_fin
            ]);
        } elseif ($request->date_debut) {
            $query->whereDate('date_debut', '>=', $request->date_debut);
        } elseif ($request->date_fin) {
            $query->whereDate('date_fin', '<=', $request->date_fin);
        }

        $reservations = $query
        ->with(['user', 'espace'])
        ->latest()
        ->paginate(10);

        return response()->json([
            'message' => 'Liste des réservations',
            'data' => ReservationResource::collection($reservations),
            'success' => true
        ], 200);
    }

    public function myReservation(){

        $reservations = auth()->user()
        ->reservations()
        ->with('espace')
        ->paginate(10);

        return response()->json([
        'message' => 'Mes réservations',
        'data' => ReservationResource::collection($reservations)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {

        $data = $request->validated();

        $espace = Espace::findOrFail($data['espace_id']);

        $debut = new \DateTime($data['date_debut']);
        $fin = new \DateTime($data['date_fin']);

        $jours = $debut->diff($fin)->days + 1;

        if ($jours <= 0) {
            return response()->json([
                'message' => 'Dates invalides',
                'success' => false
            ], 422);
        }
            $exists = Reservation::where('espace_id', $data['espace_id'])
            ->where(function ($query) use ($data) {
                $query->where('date_debut', '<=', $data['date_fin'])
                      ->where('date_fin', '>=', $data['date_debut']);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Cet espace est déjà réservé pour ces dates.',
                'success' => false
            ], 422);
        }

        $reservation = Reservation::create([
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'user_id' => Auth::id(),
            'espace_id' => $data['espace_id'],
            'prix' => $jours * $espace->tarif_jour,
            'facture_acquittee' => true,
            'statut' => 'en_attente'
        ]);

        return response()->json([
            'message' => 'Reservation créée avec succès',
            'data'    => new ReservationResource($reservation->load('espace')),
            'success' => true
        ], 201);
    }

    /**
     * Display the specified resource.
     */
        public function show(Reservation $reservation)
        {
            $this->authorize('view', $reservation);
            $reservation->load('user', 'espace');

            return response()->json([
                'message' => 'Détails de la réservation',
                'data'    => new ReservationResource($reservation),
                'success' => true
            ], 200);
        }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {

        $data = $request->validated();

        // Si on change les dates ou l'espace, vérifier les chevauchements
        $newEspaceId = $data['espace_id'] ?? $reservation->espace_id;
        $newDebut = $data['date_debut'] ?? $reservation->date_debut;
        $newFin = $data['date_fin'] ?? $reservation->date_fin;

        if (isset($data['date_debut']) || isset($data['date_fin']) || isset($data['espace_id'])) {
            $exists = Reservation::where('espace_id', $newEspaceId)
                ->where('id', '!=', $reservation->id) // Exclure la réservation actuelle
                ->where(function ($query) use ($newDebut, $newFin) {
                    $query->where('date_debut', '<=', $newFin)
                          ->where('date_fin', '>=', $newDebut);
                })
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Cet espace est déjà réservé pour ces dates.',
                    'success' => false
                ], 422);
            }
        }

        $reservation->update([
            'date_debut' => $data['date_debut'] ?? $reservation->date_debut,
            'date_fin' => $data['date_fin'] ?? $reservation->date_fin,
            'user_id' => $data['user_id'] ?? $reservation->user_id,
            'espace_id' => $data['espace_id'] ?? $reservation->espace_id,
            'prix' => $data['prix'] ?? $reservation->prix,
            'facture_acquittee' => $data['facture_acquittee'] ?? $reservation->facture_acquittee,
            'statut' => $data['statut'] ?? $reservation->statut
        ]);

        $reservation->load('user', 'espace');

        return response()->json([
            'message' => 'Réservation mise à jour avec succès',
            'data'    => new ReservationResource($reservation),
            'success' => true
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {

        $reservation->delete();

        return response()->json([
            'message' => 'Réservation supprimée avec succès',
            'success' => true
        ], 200);
    }
}
