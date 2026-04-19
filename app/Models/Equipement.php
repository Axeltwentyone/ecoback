<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    protected $fillable = [
        'libelle',
    ];

    public function espaces()
    {
        return $this->belongsToMany(Espace::class, 'espace_equipement');
    }
}
