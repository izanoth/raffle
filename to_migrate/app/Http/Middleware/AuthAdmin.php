<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Closure;
use Illuminate\Support\Facades\Log;

class AuthAdmin extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('admin.login');
    }

    public function handle($request, Closure $next, ...$guards)
    {
        if (!session()->has('admin')) {
            return redirect()->route('admin.login');
        }
        return $next($request);
    }
}
