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
    public function index()
    {
        $reservations = Reservation::paginate(10);

        return response()->json([
            'message' => 'Liste des réservations',
            'data' => $reservations,
            'success' => true
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        //
    }
}
