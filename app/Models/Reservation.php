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

    public function user()
{
    return $this->belongsTo(User::class);
}

public function espace()
{
    return $this->belongsTo(Espace::class);
}
}




