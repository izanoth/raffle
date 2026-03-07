<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CrudController;
use App\Http\Controllers\StripeController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\AuthAdmin;
use Laravel\Telescope\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

/*
 * MAIN ROUTES
 */
Route::get('/', [MainController::class, 'index'])->name('index');
Route::post('/validate', [MainController::class, 'validateForm'])->name('validate');
Route::middleware([Authenticate::class])->group(function () {
    Route::get('/checkout', [MainController::class, 'checkout'])->name('checkout');
});
Route::get('/success', [MainController::class, 'success'])->name('success');

/* 
 * ADMIN ROUTES
 */
Route::get('/admin', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/authenticate', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::middleware([AuthAdmin::class])->group(function () {
    Route::get('/admin/panel', [AdminController::class, 'panel'])->name('admin.panel');
    Route::get('/admin/list', [AdminController::class, 'list'])->name('admin.list');
    Route::get('/admin/hasher', [AdminController::class, 'hasher'])->name('admin.hasher');
    Route::post('/admin/hasher/generate', [AdminController::class, 'hasher'])->name('admin.hash.generator');
    Route::resource('/admin/crud', 'CrudController')->names([
        'index' => 'admin.crud.index',
        'create' => 'admin.crud.create',
        'store' => 'admin.crud.store',
        'show' => 'admin.crud.show',
        'edit' => 'admin.crud.edit',
        'update' => 'admin.crud.update',
        'destroy' => 'admin.crud.destroy',
    ]);
    Route::get('/telescope', '\Laravel\Telescope\Http\Controllers\HomeController@index')->name('admin.telescope');
    /*/ APIs
    // 
    *///Resources
    Route::get('/stripe/reinvite', [StripeController::class, 'stripeReinvite'])->name('admin.stripe.reinvite');
    /*
    *///Tasks
    Route::get('/stripe/succeeded', [StripeController::class, 'asyncOnceSucceeded'])->name('admin.stripe.succeeded');
});
Route::get('/raffle-timer', [MainController::class, 'getTimerData'])->name('getTimer');

Route::get('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

