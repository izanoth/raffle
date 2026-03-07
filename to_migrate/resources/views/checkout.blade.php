@extends('layouts.checkout')
@section('content')
    <p><b>
            {{ $new_client->name }}
        </b>, para efetivar a sua participação, realize o pagamento de
        R$ {{ $new_client->amount }},00 escolhendo um método de pagamento.
    </p>

    <div class="row d-flex flex-column flex-md-row justify-content-center justify-content-md-around align-items-center">
        <div class="col-md-6 pt-5 pt-md-0">
            <div class="showup">
                <img id="pix"
                    style="cursor:pointer;filter:invert(0.7);margin-left:auto;margin-right:auto;display:block;position:relative;left:-18px;"
                    src="{{ asset('img/pix.png') }}" height="70" width="auto" />
            </div>
        </div>
        <div class="col-md-6 pt-5 pt-md-0 d-flex flex-column justify-content-center align-items-center">
            <!--redirect-->
            <a href="{{ route('api.stripe', ['encodedEncryptedData' => $encodedEncryptedData]) }}"
                class="btn btn-secondary cursor-pointer w-60">Cartão de Crédito</a>
            <img class="mt-2" src="{{ asset('img/stripesecure.png') }}">
        </div>
    </div>
@endsection
