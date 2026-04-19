<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       if($request->user()->type_de_compte !== 'admin') {
        return response()->json([
            'message' => 'Accès refusé, vous devez être un administrateur pour accéder à cette ressource.',
             'success' => false
        ], 403);
       }
       return $next($request);
    }
}
