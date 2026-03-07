<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('index');
    }

    public function handle($request, Closure $next, ...$guards)
    {
        if (!session()->has('new-client')) {
            return redirect()->route('index');
        } 
        //SESSION ON MYSQL DB
        /*else {
            $sessionId = session()->getId();
            $clientId = session('new-client')['id'];
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();
            $payLoad = serialize(session('new-client'));
            $startTime = now()->timestamp;
            DB::table('sessions')->insert([
                'id' => $sessionId,
                'user_id' => $clientId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'payload' => $payLoad,
                'last_activity' => $startTime,
            ]);
        }*/
        return $next($request);
    }
}
