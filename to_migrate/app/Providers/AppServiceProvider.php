<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use App\Helpers\Functions;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //CPF VALIDATOR
        Validator::extend('cpf', function ($attribute, $value, $parameters, $validator) {
            $value = preg_replace("/[^0-9]/", "", $value);
            $result = Functions::validateCpf($value);
            Log::info("RESULT VALIDATION: ");
            Log::info("RESULT VALIDATION: ".$result);
            if (strlen($value) == 11) {
                if ($result) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        Schema::defaultStringLength(191);
    }
}

