<?php
// app/Http/Controllers/MyController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use Exception;

class AdminController extends Controller
{
    public function login()
    {
        return view('admin.login');
    }

    public function authenticate(Request $request)
    {
        $input_data = $request->all();
        $hashedPassword = config('services.admin.key');
        $admin = config('services.admin.user');
        $inputAdmin = $input_data['admin'];
        $inputPassword = $input_data['password'];

        if (Hash::check($inputPassword, $hashedPassword) && $inputAdmin == $admin) {
            session()->put('admin', $admin);
            return redirect()->route('admin.panel');
        } else {
            return redirect()->route('admin.login')->withErrors('credentials');
        }
    }
    private function Registers()
    {
        $Registers = count(Client::all());
        return $Registers;
    }
    private function Payments()
    {
        $Payments = count(Client::where('paid', 1)->get());
        return $Payments;
    }
    private function Intents()
    {
        $Intents = count(Client::where(function ($query) {
            $query->whereNotNull('stripe_id')
                ->orWhereNotNull('asaas_id');
        })
            ->where(function ($query) {
                $query->where('paid', 0);
            })->get());
        $Stripe = count(Client::whereNotNull('stripe_id')
            ->where('paid', 0)
            ->get());
        $Asaas = count(Client::whereNotNull('asaas_id')
            ->where('paid', 0)
            ->get());
        $Both = count(Client::where(function ($query) {
            $query->whereNotNull('stripe_id')
                ->where('paid', 0);
        })
            ->where(function ($query) {
                $query->whereNotNull('asaas_id')
                ->where('paid', 0);
            })->get());
        $intents = json_encode(array('intents' => $Intents, 'stripe' => $Stripe, 'asaas' => $Asaas, 'both' => $Both));
        return $intents;
    }
    public function panel()
    {
        //Status
        $registers = $this->Registers();
        $payments = $this->Payments();
        $intents = json_decode($this->Intents());
        return view('admin.panel')->with([
            'registers' => $registers,
            'payments' => $payments,
            'intents' => $intents->intents,
            'stripeIntents' => $intents->stripe,
            'asaasIntents' => $intents->asaas,
            'bothIntents' => $intents->both,
        ]);
    }
    public function list(Request $request)
    {
        $clients = Client::all();
        $admin = $request->get('admin');
        Log::info("ADMIN: " . json_encode($admin));
        $ids = DB::table('clients')
            ->where('paid', 0)
            ->whereNotNull('stripe_id') /*//*/
            ->pluck('id')
            ->toArray();

        return view('admin.list')->with(['clients' => $clients, 'toReinvite' => $ids]);
    }
    public function hasher(Request $request)
    {
        if ($request->get('init') !== null) {
            return view('admin.hasher');
        } else {
            $password = $request->get('password');
            $hashedPassword = Hash::make($password);
            return view('admin.hasher')->with(['hash' => $hashedPassword]);
        }
    }

    public function logout()
    {
        Session::flush();
        Session::regenerate(true);
        return redirect()->route('admin.login');
    }
}