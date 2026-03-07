<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\AsaasController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\AuthAdmin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
 * APIs
 */
//***Route::get('/authenticate', [ApiController::class, 'authenticate'])->name('api.authenticate');
Route::get('/stripe', [StripeController::class, 'asyncStripe'])->name('api.stripe');
Route::get('/stripe/retrieve', [StripeController::class, 'stripeRetrieve'])->name('api.stripe.retrieve');
    //Fully asynchonous
Route::post('/asaas', [AsaasController::class, 'asyncAsaas'])->name('api.asaas');
Route::get('/asaas/pooling', [AsaasController::class, 'polling'])->name('api.asaas.polling');
Route::get('/asaas/getsecret', [AsaasController::class, 'getSecret'])->name('api.asaas.getSecret');
/*
 * WEBHOOKS
 */
Route::post('/asaas/webhook', [AsaasController::class, 'webhook']);
