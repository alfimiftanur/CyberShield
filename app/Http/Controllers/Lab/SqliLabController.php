<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\ExploitAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SqliLabController extends Controller
{
    // ENDPOINT VULNERABLE — sengaja raw query, rentan SQLi
    public function vulnerableLogin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $result = [];
        $error = null;

        try {
            // SENGAJA VULNERABLE: string concatenation langsung ke query
            $rows = DB::select("SELECT * FROM lab_accounts WHERE username = '$username' AND password = '$password'");
            $result = $rows;
        } catch (\Exception $e) {
            $error = $e->getMessage();
        }

        $status = !empty($result) ? 'success' : ($error ? 'error' : 'blocked');

        // Logging WAJIB pakai Eloquent (parameter binding otomatis), terpisah dari query di atas
        ExploitAttempt::create([
            'user_id' => Auth::id(),
            'vulnerability_module_id' => 1, // sesuaikan dengan id modul SQLi di tabel kamu
            'target_version' => 'vulnerable',
            'payload_used' => "username: $username | password: $password",
            'result' => $status,
            'response_snapshot' => json_encode($result),
            'attempted_at' => now(),
        ]);

        return back()->with([
            'lab_result' => $result,
            'lab_status' => $status,
        ]);
    }

    // ENDPOINT FIXED — parameter binding, aman
    public function fixedLogin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $rows = DB::select(
            "SELECT * FROM lab_accounts WHERE username = ? AND password = ?",
            [$username, $password]
        );

        $status = !empty($rows) ? 'success' : 'blocked';

        ExploitAttempt::create([
            'user_id' => Auth::id(),
            'vulnerability_module_id' => 1,
            'target_version' => 'fixed',
            'payload_used' => "username: $username | password: $password",
            'result' => $status,
            'response_snapshot' => json_encode($rows),
            'attempted_at' => now(),
        ]);

        return back()->with([
            'lab_result' => $rows,
            'lab_status' => $status,
        ]);
    }
}