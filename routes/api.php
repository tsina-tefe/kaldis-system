<?php

use App\Http\Controllers\ManagerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/departments', [ManagerController::class, 'departmentsByBranch'])->name('departments.byBranch');
});