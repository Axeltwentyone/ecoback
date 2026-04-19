<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'date_debut',
        'date_fin',
        'statut',
        'prix',
        'espace_id'
    ];
}
