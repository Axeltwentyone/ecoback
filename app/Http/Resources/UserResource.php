<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'adresse_postale' => $this->adresse_postale,
            'type_de_compte' => $this->type_de_compte,
            'reservations' => ReservationResource::collection($this->whenLoaded('reservations')),
        ];
    }
}
