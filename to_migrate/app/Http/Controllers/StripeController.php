<?php
// app/Http/Controllers/StripeController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use Exception;
use Illuminate\Support\Facades\Log;
use Stripe;
use Illuminate\Support\Facades\Mail;
use App\Mail\Reinvite;
use App\Helpers\Functions;

class StripeController extends Controller
{
    public function asyncStripe(Request $request)
    {
        if (!$request->has('encodedEncryptedData')) {
            return redirect()->route('index');
        }
        $encodedEncryptedData = $request->get('encodedEncryptedData');
        $strData = Functions::decodingAndCryptingData($encodedEncryptedData);

        $new_client = json_decode($strData, true);

        $_token = $new_client['_token'];
        $id = $new_client['id'];
        $name = $new_client['name'];
        $email = $new_client['email'];
        $phone = $new_client['phone'];
        $amount = $new_client['amount'];

        $secret = config('services.stripe.secret');
        $stripe = new \Stripe\StripeClient($secret);

        try {
            $intent = $stripe->paymentIntents->create([
                'amount' => $amount * 100,
                'currency' => 'brl',
                'capture_method' => 'automatic',
                'receipt_email' => $email,
                'description' => 'Rifart',
            ]);

            $customer = $stripe->customers->create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
            ]);
            DB::table('clients')
                ->where('id', $id)
                ->update(['stripe_id' => $intent->id]);

            session()->flash('new-client', $name);
            return view('api.stripe')->with([
                '_token' => $_token,
                'client_id' => $id,
                'clientSecret' => $intent->client_secret,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function stripeRetrieve(Request $request)
    {
        if (!$request->has('encryptedEncodedData')) {
            return redirect()->route('index');
        }
        $data = json_decode(Functions::decodingAndCryptingData($request->get('encryptedEncodedData')));
        $id = $data[0]->id;
        $name = $data[0]->name;
        $paymentIntentId = $data[0]->stripe_id;

        $secret = config('services.stripe.secret');
        $stripe = new \Stripe\StripeClient($secret);
        $paymentIntent = $stripe->paymentIntents->retrieve($paymentIntentId);
        $clientSecret = $paymentIntent->client_secret;
        $name = DB::table('clients')->select('name')->where('id', $id)->get();
        return view('api.stripe')->with([
            'client_id' => $id,
            'name' => $name,
            'clientSecret' => $clientSecret
        ]);
    }
    private function reinviteMailer($id)
    {
        $client = DB::table('clients')
            ->select('id', 'name', 'email', 'stripe_id')
            ->where('id', $id);
        $data = $client->get();
        $name = $data[0]->name;
        $email = $data[0]->email;
        $encryptedEncodedData = Functions::encryptAndCodingData(json_encode($data));
        //return dd($encryptedEncodedData);
        if(Mail::to($email)->send(new Reinvite($name, $encryptedEncodedData))) {
            Log::info("Mail has been sent");
        }
        else {
            return 'Erro';
        }
    }
    public function stripeReinvite(Request $request)
    {
        $data = $request->all();
        $ids = $data['id'];
        //Fresh reinvite
        if (is_array($ids)) {
            foreach ($ids as $id) {
                $this->reinviteMailer($id);
            }
            return view('admin.list')->with([
                'clients' => CLient::all(),
                'toReinvite' => $ids,
                'message' => count($ids) . " mails has been sent"
            ]);
            //Unique
        } else {
            $id = $data['id'];
            $this->reinviteMailer($id);
            $clients = Client::whereNotNull('asaas_id')
                ->orWhereNotNull('stripe_id')
                ->where('paid', 0)
                ->get();
            $ids = $clients->pluck('id')->toArray();
            return view('admin.list')->with([
                'clients' => Client::all(),
                'toReinvite' => $ids,
                'message' => "Mail has been sent"
            ]);
        }
    }
    public function asyncOnceSucceeded(Request $request)
    {
        //PS: ASAAS by Webhook
        if ($request->get('id')) {
            $data = $request->all();
            $id = $data['client_id'];
            DB::table('clients')->where('id', $id)->update(['paid' => 1]);
            session()->flush();
            return view('success')->with([
                'id' => $id
            ]);
        } else {
            return redirect()->route('index');
        }
    }
}
