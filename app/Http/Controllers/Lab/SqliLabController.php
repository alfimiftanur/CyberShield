<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\ExploitAttempt;
use App\Models\VulnerabilityModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SqliLabController extends Controller
{
    public function vulnerableLogin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $result = [];
        $error  = null;

        try {
            $rows   = DB::select("SELECT * FROM lab_accounts WHERE username = '$username' AND password = '$password'");
            $result = $rows;
        } catch (\Exception $e) {
            $error = $e->getMessage();
            \Log::error('SQLi Lab Error: ' . $e->getMessage());
        }

        $status    = !empty($result) ? 'success' : ($error ? 'error' : 'blocked');
        $moduleId  = VulnerabilityModule::where('category', 'sql_injection')->value('id');

        ExploitAttempt::create([
            'user_id'                  => Auth::id(),
            'vulnerability_module_id'  => $moduleId,
            'target_version'           => 'vulnerable',
            'payload_used'             => "username: $username | password: $password",
            'result'                   => $status,
            'response_snapshot'        => json_encode($result),
            'attempted_at'             => now(),
        ]);

        return back()->with([
            'lab_result' => $result,
            'lab_status' => $status,
        ]);
    }

    public function fixedLogin(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $rows      = DB::select(
            "SELECT * FROM lab_accounts WHERE username = ? AND password = ?",
            [$username, $password]
        );
        $status    = !empty($rows) ? 'success' : 'blocked';
        $moduleId  = VulnerabilityModule::where('category', 'sql_injection')->value('id');

        ExploitAttempt::create([
            'user_id'                  => Auth::id(),
            'vulnerability_module_id'  => $moduleId,
            'target_version'           => 'fixed',
            'payload_used'             => "username: $username | password: $password",
            'result'                   => $status,
            'response_snapshot'        => json_encode($rows),
            'attempted_at'             => now(),
        ]);

        return back()->with([
            'lab_result' => $rows,
            'lab_status' => $status,
        ]);
    }
}