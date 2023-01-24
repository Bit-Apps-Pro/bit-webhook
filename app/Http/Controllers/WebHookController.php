<?php

namespace App\Http\Controllers;

use App\Models\Logs;
use App\Models\UrlSlugGenerate;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Ramsey\Uuid\Rfc4122\UuidV5;
use Ramsey\Uuid\Uuid;

/**
 * WebHookController
 */
class WebHookController extends Controller
{
    /**
     * Moves the uploaded files if file exists in request
     *
     * @param Request $request
     *
     * @return array
     */
    public function processUploadedFiles($request)
    {
        $allFiles = $request->allFiles();
        if (empty($allFiles)) {
            return [];
        }
        $tempFileController = new TempFileController();
        return $tempFileController->moveUploadedFiles($request);
    }
    /**
     * Handle incoming request
     *
     * @param Request $request
     *
     * @return array
     */
    public function getRequestDetails($request)
    {
        $queryParams = $request->query();
        $formData = $request->post();
        if (($content = $request->getContent()) && empty($formData)) {
            $decoded = json_decode($content, true);
            if (json_last_error()) {
                $formData['body_content'] = $content;
            } else {
                $formData = array_merge($formData, $decoded);
            }
        }

        if ($fileLinks = $this->processUploadedFiles($request)) {
            $formData = array_merge($formData, $fileLinks);
        }

        $headers = $request->header();
        $method = $request->method();
        $url = URL::full();
        $path = $request->path();
        $ip = $request->ip();

        if (isset($headers['cookie'])) {
            unset($headers['cookie']);
        }

        if (isset($headers['content-type']) && $headers['content-type'][0] == 'text/plain') {
            $formData = json_decode($request->getContent(), true);
        }

        $dateTime = new DateTime();
        $dateTime->setTimezone(new \DateTimeZone('Asia/Dhaka'));
        $createdLogTime = $dateTime->format('d-m-Y h:i:s A');

        return [
            'query_params' => $queryParams,
            'form_data'    => $formData,
            'headers'     => $headers,
            'method'      => $method,
            'url'         => $url,
            'path'        => $path,
            'ip'          => $ip,
            'created_at'  => $createdLogTime,
        ];
    }

    public function getWebHookData(Request $request, $url_slug)
    {
        $isValidURL = UrlSlugGenerate::where('url_slug', $url_slug)->first();

        if (!$isValidURL) {
            return response()->json(['success' => false, 'message' => 'Invalid URL']);
        }

        $details = $this->getRequestDetails($request);
        $rayID = Uuid::uuid4()->toString();
        broadcast(
            new \App\Events\WebhookLogEvent(
                $url_slug,
                [
                    'id' => $rayID,
                    'webhook_details' => json_encode($details),
                ]
            )
        );

        return response()->json(['success' => true, 'data' => ['rID' => $rayID]]);
    }

    public function outgoingView()
    {
        return Inertia::render('Outgoing');
    }
}
