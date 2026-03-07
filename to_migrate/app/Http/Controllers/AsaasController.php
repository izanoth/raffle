<?php
// app/Http/Controllers/AsaasController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use GuzzleHttp\Client as Buddy;
use Exception;
use App\Helpers\Functions;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class AsaasController extends Controller
{
    public function asyncAsaas(Request $request)
    {
        $data = $request->all();
        $client_id = $data['client_id'];
        $name = $data['name'];
        $cpf = $data['cpf'];
        $phone = $data['phone'];
        $value = $data['value'];
        $pix = config('services.asaas.pix');
        $access_token = config('services.asaas.key');
        $cus_endpoint = config('services.asaas.cus_endpoint');

        $client = new Buddy([
            'verify' => false, //<<<<<<<<<<<<<<<<<<<<<<<<<<<< PRODUCTION
        ]);

        try {
            $response = $client->post($cus_endpoint, [
                'headers' => [
                    'accept' => 'application/json',
                    'access_token' => $access_token,
                    'content-type' => 'application/json',
                ],
                'json' => [
                    "name" => $name,
                    "cpfCnpj" => $cpf,
                    "mobilePhone" => $phone,
                ],
            ]);

            $jsonResponse = json_decode($response->getBody(), true);
            $customer_id = $jsonResponse['id'];
            $pay_endpoint = config('services.asaas.pay_endpoint');
            $dueDate = now()->addDays(2)->format('Y-m-d');

            $response = $client->post($pay_endpoint, [
                'headers' => [
                    'accept' => 'application/json',
                    'access_token' => $access_token,
                    'content-type' => 'application/json',
                ],
                'json' => [
                    'customer' => $customer_id,
                    'billingType' => 'PIX',
                    'value' => $value,
                    'dueDate' => $dueDate,
                ],
            ]);

            $jsonResponse_charge = json_decode($response->getBody(), true);
            $payment_id = $jsonResponse_charge['id'];
            $qr_endpoint = config('services.asaas.qr_endpoint');
            $qrCode_endpoint = str_replace('{id}', $payment_id, $qr_endpoint);
            $response = $client->get($qrCode_endpoint, [
                'headers' => [
                    'accept' => 'application/json',
                    'access_token' => $access_token,
                ],
            ]);

            $jsonResponse_qr = json_decode($response->getBody(), true);
            $success = $jsonResponse_qr['success'];
            $encodedImage = $jsonResponse_qr['encodedImage'];
            $payload = $jsonResponse_qr['payload'];

            DB::table('clients')
                ->where('id', $client_id)
                ->update(['asaas_id' => $payment_id]);

            return response()->json([
                'success' => $success,
                'payload' => $payload,
                'qrcode' => $encodedImage,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function polling(Request $request)
    {
        $id = $request->get('id');
        $client = Client::find($id);
        if ($client) {
            $paid = $client->paid;
        }
        $paid != 0 ?
            $confirmed = true :
            $confirmed = false;
        
        Log::info("Confirmed?: ".strval($paid));
        if ($confirmed) {
            session()->flash('new-client', $client->pluck('name'));
            echo json_encode(array('confirmed' => true));
        } else {
            echo json_encode(array('confirmed' => false));
        }
    }
    public function getSecret(Request $request)
    {
        $encodedEncryptedData = $request->get('encodedEncryptedData');
        return Functions::decodingAndCryptingData($encodedEncryptedData);
    }
    public function webhook(Request $request)
    {
        Log::info("Request->all(): ".json_encode($request->all()));
        
        if ($request->method() !== 'POST') {
            abort(405, 'Método não permitido');
        }
        $webhookData = $request->getContent();

        Log::info("Request->getContent(): ".$webhookData);
        if (empty($webhookData)) {
            abort(400, 'Corpo da requisição vazio');
        }

        Storage::append('webhook_log.txt', $webhookData);

        $webhookPayload = json_decode($webhookData);
        Log::info("webhookPayload->event: ".$webhookPayload->event);

        if ($webhookPayload->event === 'PAYMENT_RECEIVED') {
            DB::table('clients')
                ->where('asaas_id', $webhookPayload->payment->id)
                ->update(['paid' => 1]);
            return response()->json(['message' => 'Evento PAYMENT_CONFIRMED recebido, obrigado']);
        } else {
            return response()->json(['message' => 'Evento não é PAYMENT_CONFIRMED'], 200);
        }
    }    
}