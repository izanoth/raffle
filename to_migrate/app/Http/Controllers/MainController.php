<?php
// app/Http/Controllers/MainController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\Success;
use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Log;
use App\Helpers\Functions;
use Illuminate\Support\Facades\Session;
use App\Models\Session as newSession;
use App\Models\Raffle;
class MainController extends Controller
{
    public function index()
    {
        return view('index');
    }
    private function gen_tickets($units)
    {
        $tickets = [];
        for ($i = 0; $i < $units; $i++) {
            $unique = false;
            while (!$unique) {
                $randomNumber = rand(1000, 9999);
                $exists = Client::whereRaw("JSON_CONTAINS(tickets, '\"$randomNumber\"')")->exists();
                if (!$exists) {
                    array_push($tickets, $randomNumber);
                    $unique = true;
                }
            }
        }
        $tickets = json_encode($tickets);
        return $tickets;
    }

    public function validateForm(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|regex:/^[a-zA-Z\s]*$/',
            'units' => 'required|integer',
            'cpf' => 'required|cpf',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'terms' => 'required|accepted',
        ]);
        $client = new Client();
        $client->name = $request->input('name');
        $units = $request->input('units');
        $amount = $units * 5;
        $client->amount = $amount;
        $cpf = str_replace(['-', '.'], '', $request->input('cpf'));
        $client->cpf = $cpf;
        $client->email = $request->input('email');
        $client->tickets = $this->gen_tickets($units);
        $phone = str_replace(['(', ')', '-', ' '], '', $request->input('phone'));
        $client->phone = $phone;
        $validator = Validator::make($validator, []);

        Log::info("ERRORS: ".$validator->errors());

        if ($validator->fails()) {
            return redirect('/')->withErrors($validator)->withInput();
        }
        $client->save();
        session()->put('new-client', $client);
        session()->save();
        return redirect()->route('checkout');
    }
    public function checkout(Request $request)
    {
        $client = session('new-client');
        $data = [
            '_token' => csrf_token(),
            'id' => $client['id'],
            'name' => $client['name'],
            'email' => $client['email'],
            'cpf' => $client['cpf'],
            'phone' => $client['phone'],
            'amount' => $client['amount'],
        ];
        $encodedEncryptedData = Functions::encryptAndCodingData(json_encode($data));

        session()->flash('new-client', $client);
        return view('checkout')->with([
            'new_client' => $client,
            'encodedEncryptedData' => $encodedEncryptedData
        ]);
    }
    public function success(Request $request)
    {
        $data = $request->all();
        $id = $data['id'];
        $client = Client::find($id);
        $data = [
            'name' => $client->name,
            'tickets' => $client->tickets,
        ];
        Client::find($id)->update(['paid' => 1]);

        Mail::to($client->email)->send(new Success($data['name'], $data['tickets']));
        return view("success")->with([
            'name' => $data['name'],
            'tickets' => $data['tickets'],
        ]);
    }

    public function getTimerData()
    {
        $raffle = Raffle::first();
        Log::info($raffle);
        return response()->json($raffle);
    }
}