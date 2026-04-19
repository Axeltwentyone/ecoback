<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation', function (Blueprint $table) {
            $table->id();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('prix', 8, 2);
            $table->boolean('facture_acquittee')->default(false);
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee'])->default('en_attente');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('espace_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation');
    }
};
