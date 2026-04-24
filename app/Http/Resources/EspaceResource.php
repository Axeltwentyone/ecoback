<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EspaceResource extends JsonResource
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
            'nom' => $this->nom,
            'surface' => $this->surface,
            'type' => $this->type,
            'tarif_jour' => $this->tarif_jour,
            'photo' => $this->photo,
            'is_available' => $this->is_available ?? true,

            'equipements' => EquipementResource::collection($this->whenLoaded('equipements')),
            'reservations' => ReservationResource::collection($this->whenLoaded('reservations')),
        ];
    }
}
