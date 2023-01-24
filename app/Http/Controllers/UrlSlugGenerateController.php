<?php

namespace App\Http\Controllers;

use App\Models\UrlSlugGenerate;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class UrlSlugGenerateController extends Controller
{
    public function createNewRandomURl()
    {
        $uniqueId = $this->generateUuid();
        $message = [
            'success'   => false,
            'message'  => 'Failed to generate url',
            'uniqueId' => $uniqueId,
        ];
        if ($uniqueId) {
            $message['success']   = true;
            $message['message']  = 'URL generated successfully';
        }
        return response()->json($message);
    }

    public function refreshUrl(Request $request)
    {
        $deleted = UrlSlugGenerate::where('url_slug', $request->url)->delete();
        $message = [
            'success'   => false,
            'message'  => 'something went wrong'
        ];
        if ($deleted) {
            $uniqueId = $this->generateUuid();
            $message['uniqueId'] = $uniqueId;
            if ($uniqueId) {
                $message['success']   = true;
                $message['message']  = 'New URL generated successfully';
            } else {
                $message['message']  = 'Failed to generate new url';
            }
        }
        return response()->json($message);
    }

    /**
     * Generates uuid using Ramsey's Uuid with v4
     *
     * @return false | string
     */
    private function generateUuid()
    {
        $uniqueId = Uuid::uuid4()->toString();
        $saveUniqueId = new UrlSlugGenerate();
        $saveUniqueId->url_slug = $uniqueId;
        return $saveUniqueId->save() ? $uniqueId : false;
    }
}
