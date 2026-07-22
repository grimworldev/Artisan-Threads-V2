<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::resource('users', UserController::class)->only(['store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
     Route::resource('users', UserController::class)->except(['store']);
     Route::resource('profiles', ProfileController::class);
});

require __DIR__.'/settings.php';
