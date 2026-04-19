<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Espace extends Model
{
    protected $fillable = [
        'nom',
        'surface',
        'type',
        'tarif_jour',
        'photo',
    ];
}
