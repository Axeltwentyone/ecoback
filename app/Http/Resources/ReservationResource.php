<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'statut' => $this->statut,
            'prix' => $this->prix,
            'facture_acquittee' => $this->facture_acquittee,
            'espace' => new EspaceResource($this->whenLoaded('espace')),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
