<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDocumentsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::resource('users', UserController::class)->only(['store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class)->except(['store']);

    //  PROFILE ROUTES FOR IMAGES AND OTHER SETTINGS
    Route::post('/profiles/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.update');
    Route::post('/profiles/cover', [ProfileController::class, 'uploadCover'])->name('profile.cover.update');
    Route::delete('/profiles/cover', [ProfileController::class, 'destroyCover'])->name('profile.cover.destroy');
    Route::get('/profiles/{username}/business/registration', [ProfileController::class, 'businessCreate'])->name('profile.business.create');
    Route::get('/profiles/{username}/account/verification', [ProfileController::class, 'documentCreate'])->name('profile.document.create');
    // Resource for Profile, For Personal Account details
    Route::resource('profiles', ProfileController::class);
    Route::resource('shops', ShopsController::class);
    Route::resource('documents', UserDocumentsController::class);
});

require __DIR__ . '/settings.php';
