<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'date_debut',
        'date_fin',
        'user_id',
        'espace_id',
        'facture_acquittee',
        'statut',
        'prix'
    ];
}
