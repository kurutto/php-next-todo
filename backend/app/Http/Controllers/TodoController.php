<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $todo = Todo::create([
            'user_id' => $userId,
            'title' => $request->input('title'),
            'completed' => false,
        ]);

        return $todo;
    }

    public function update(Request $request, int $id)
    {
        $userId = $request->user()->id;
        $todo = Todo::where('user_id', $userId)->where('id', $id)->first();
        if (! $todo) {
            return response()->json([
                'message' => 'Todoが見つかりません',
            ], 404);
        }
        $todo->update([
            'title' => $request->title,
            'completed' => $request->completed,
        ]);

        return response()->json([
            'message' => '更新成功',
            'todo' => $todo,
        ]);
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $todos = Todo::where('user_id', $userId)->get();

        return response()->json($todos);
    }

    public function destroy(Request $request, string $id)
    {
        $userId = $request->user()->id;
        $todo = Todo::where('user_id', $userId)->where('id', $id)->first();

        if (! $todo) {
            return response()->json([
                'message' => 'Todoが見つかりません',
            ], 404);
        }

        $todo->delete();

        return response()->json([
            'message' => '削除成功',
        ]);
    }
}
