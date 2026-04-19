<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\EspaceController;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\ReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (connecté)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Espaces
    Route::get('/espaces', [EspaceController::class, 'index']);
    Route::get('/espaces/{espace}', [EspaceController::class, 'show']);

    // Réservations
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    // Routes admin
    Route::middleware('is-admin')->group(function () {

        // Gestion des espaces
        Route::post('/espaces', [EspaceController::class, 'store']);
        Route::put('/espaces/{espace}', [EspaceController::class, 'update']);
        Route::delete('/espaces/{espace}', [EspaceController::class, 'destroy']);

        // Gestion des équipements
        Route::apiResource('/equipements', EquipementController::class);

        // Gestion des utilisateurs
        Route::get('/users', [AdminController::class, 'index']);
        Route::get('/users/{user}', [AdminController::class, 'show']);
        Route::put('/users/{user}', [AdminController::class, 'update']);
        Route::delete('/users/{user}', [AdminController::class, 'destroy']);
        Route::post('/users/{id}/restore', [AdminController::class, 'restore']);
        Route::delete('/users/{id}/force-delete', [AdminController::class, 'forceDelete']);
        Route::post('/admin/create', [AdminController::class, 'CreateAdmin']);
    });
});
