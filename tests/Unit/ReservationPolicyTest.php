<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Reservation;
use App\Policies\ReservationPolicy;
use PHPUnit\Framework\TestCase;

class ReservationPolicyTest extends TestCase
{
    private ReservationPolicy $policy;

    // Cette méthode s'exécute avant chaque test
    // Elle crée une instance de la Policy
    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new ReservationPolicy();
    }

    /**
     * Scénario 1 — Un user voit SA réservation
     * Résultat attendu : TRUE
     */
    public function test_user_peut_voir_sa_propre_reservation(): void
    {
        // On prépare — faux user avec id=1
        $user = new User();
        $user->id = 1;
        $user->type_de_compte = 'client';

        // On prépare — fausse réservation appartenant à ce user
        $reservation = new Reservation();
        $reservation->user_id = 1;

        // On exécute et on vérifie
        $this->assertTrue(
            $this->policy->view($user, $reservation)
        );
    }

    /**
     * Scénario 2 — Un user essaie de voir la réservation d'un AUTRE
     * Résultat attendu : FALSE
     */
    public function test_user_ne_peut_pas_voir_reservation_dun_autre(): void
    {
        // User avec id=1
        $user = new User();
        $user->id = 1;
        $user->type_de_compte = 'client';

        // Réservation qui appartient à user id=2
        $reservation = new Reservation();
        $reservation->user_id = 2;

        // Doit retourner FALSE
        $this->assertFalse(
            $this->policy->view($user, $reservation)
        );
    }

    /**
     * Scénario 3 — Un admin voit n'importe quelle réservation
     * Résultat attendu : TRUE
     */
    public function test_admin_peut_voir_nimporte_quelle_reservation(): void
    {
        // Admin
        $user = new User();
        $user->id = 1;
        $user->type_de_compte = 'admin';

        // Réservation qui appartient à quelqu'un d'autre
        $reservation = new Reservation();
        $reservation->user_id = 99;

        // Doit retourner TRUE car c'est un admin
        $this->assertTrue(
            $this->policy->view($user, $reservation)
        );
    }

    /**
     * Scénario 4 — Un user supprime SA réservation
     * Résultat attendu : TRUE
     */
    public function test_user_peut_supprimer_sa_propre_reservation(): void
    {
        $user = new User();
        $user->id = 1;
        $user->type_de_compte = 'client';

        $reservation = new Reservation();
        $reservation->user_id = 1;

        $this->assertTrue(
            $this->policy->delete($user, $reservation)
        );
    }

    /**
     * Scénario 5 — Un user supprime la réservation d'un AUTRE
     * Résultat attendu : FALSE
     */
    public function test_user_ne_peut_pas_supprimer_reservation_dun_autre(): void
    {
        $user = new User();
        $user->id = 1;
        $user->type_de_compte = 'client';

        $reservation = new Reservation();
        $reservation->user_id = 2;

        $this->assertFalse(
            $this->policy->delete($user, $reservation)
        );
    }
}
