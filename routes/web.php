<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Lab\SqliLabController;
use App\Http\Controllers\Lab\XssLabController;
use App\Models\VulnerabilityModule;
use App\Models\ExploitAttempt;
use App\Models\XssComment;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'vulnerabilityModules' => VulnerabilityModule::all(),
        'exploitAttempts' => ExploitAttempt::where('user_id', auth()->id())
            ->latest('attempted_at')
            ->get(),
        'xssComments' => [
            'vulnerable' => XssComment::where('target_version', 'vulnerable')->latest()->get(),
            'fixed'      => XssComment::where('target_version', 'fixed')->latest()->get(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/lab/sqli/vulnerable/login', [SqliLabController::class, 'vulnerableLogin'])->name('lab.sqli.vulnerable');
    Route::post('/lab/sqli/fixed/login', [SqliLabController::class, 'fixedLogin'])->name('lab.sqli.fixed');
    Route::post('/lab/xss/vulnerable/comment', [XssLabController::class, 'vulnerableComment'])->name('lab.xss.vulnerable');
    Route::post('/lab/xss/fixed/comment', [XssLabController::class, 'fixedComment'])->name('lab.xss.fixed');
});

require __DIR__.'/auth.php';
