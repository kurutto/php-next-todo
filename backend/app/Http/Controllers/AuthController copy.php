<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8'],
            ]);
            $user = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']), // bcrypt関数ではなくLaravel標準のものを使用
            ]);

            return response()->json([
                'message' => 'ユーザー登録成功',
                'user' => $user,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'ユーザー登録に失敗しました',
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return $request->user();
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([ // validate メソッドは失敗したら ValidationException という error を throw する。
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (! Auth::attempt($credentials)) {
                return response()->json([
                    'message' => 'メールアドレスまたはパスワードが違います',
                ], 401);
            }
            $request->session()->regenerate(); //ログイン前後で Session ID を変えることでセッション固定攻撃(Session Fixation)対策

            return response()->json([
                'message' => 'ログイン成功',
                'user' => Auth::user(), // ログイン中のユーザーを返す
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'バリデーションエラー',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'ログインに失敗しました',
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            // Auth::logout();　sanctumは内部で session cookie / bearer token があるので、リクエストによって SessionGuard にも RequestGuard にもなってしまう。そのため、エラーになることがある。
            auth('web')->logout(); // laravelのヘルパー関数を使う。

            $request->session()->invalidate(); //セッション全破棄,Session ID削除。新しいID作成。リクエスト後に Session middleware がsessionテーブルを更新する

            $request->session()->regenerateToken(); //CSRFトークン再生成

            return response()->json([
                'message' => 'ログアウト成功',
            ]);

        } catch (\Throwable $e) { // 「\」はグローバル名前空間
            return response()->json([
                'message' => 'ログアウトに失敗しました',
            ], 500);
        }
    }
}
