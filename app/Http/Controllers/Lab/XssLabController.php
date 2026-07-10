<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\ExploitAttempt;
use App\Models\VulnerabilityModule;
use App\Models\XssComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class XssLabController extends Controller
{
    public function vulnerableComment(Request $request)
    {
        $this->storeComment($request, 'vulnerable');
        return back();
    }

    public function fixedComment(Request $request)
    {
        $this->storeComment($request, 'fixed');
        return back();
    }

    private function storeComment(Request $request, string $targetVersion)
    {
        $authorName = $request->input('author_name');
        $body       = $request->input('body');

        XssComment::create([
            'author_name'    => $authorName,
            'body'           => $body,
            'target_version' => $targetVersion,
        ]);

        $moduleId = VulnerabilityModule::where('category', 'xss')->value('id');

        ExploitAttempt::create([
            'user_id'                 => Auth::id(),
            'vulnerability_module_id' => $moduleId,
            'target_version'          => $targetVersion,
            'payload_used'            => $body,
            'result'                  => $targetVersion === 'vulnerable' ? 'success' : 'blocked',
            'response_snapshot'       => null,
            'attempted_at'            => now(),
        ]);
    }
    public function resetComments()
    {
        XssComment::truncate();
        return back();
    }
}