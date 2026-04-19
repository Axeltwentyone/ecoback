<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\reservation\StoreReservationRequest;
use App\Http\Requests\reservation\UpdateReservationRequest;

use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservation::query();

        if ($request->date) {
            $query->whereDate('date_debut', $request->date);
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date_debut', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';

        $reservations = $query->orderBy($sortBy, $sortOrder)
                            ->paginate(10);

        return response()->json([
            'message' => 'Liste des réservations',
            'data' => $reservations,
            'success' => true
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();

        $reservation = Reservation::create([
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'user_id' => $data['user_id'],
            'espace_id' => $data['espace_id'],
            'prix' => $data['prix'],
            'facture_acquittee' => $data['facture_acquittee'] ?? false,
            'statut' => $data['statut']
        ]);

        return response()->json([
            'message' => 'Reservation crée avec succès',
            'data' =>$reservation,
            'success' => true
        ], 201);
    }

    /**
     * Display the specified resource.
     */
        public function show(Reservation $reservation)
        {
            return response()->json([
                'message' => 'Détails de la réservation',
                'data' => $reservation,
                'success' => true
            ], 200);
        }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        $data = $request->validated();

        $reservation->update([
            'date_debut' => $data['date_debut'] ?? $reservation->date_debut,
            'date_fin' => $data['date_fin'] ?? $reservation->date_fin,
            'user_id' => $data['user_id'] ?? $reservation->user_id,
            'espace_id' => $data['espace_id'] ?? $reservation->espace_id,
            'prix' => $data['prix'] ?? $reservation->prix,
            'facture_acquittee' => $data['facture_acquittee'] ?? $reservation->facture_acquittee,
            'statut' => $data['statut'] ?? $reservation->statut
        ]);

        return response()->json([
            'message' => 'Réservation mise à jour avec succès',
            'data' => $reservation,
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
