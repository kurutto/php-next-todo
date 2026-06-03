<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;
use App\Events\TestNotification;

Route::get('/health', function () {
    return ['status' => 'ok'];
});

Route::post('/broadcast-test', function () {
    broadcast(new TestNotification('こんにちは'));

    return response()->json([
        'message' => 'sent',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos', [TodoController::class, 'index']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
});
