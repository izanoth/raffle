@extends('layouts.emails')

@section('header')
    <h1 class="py-3 text-light">Olá, {{ $name }}!</h1>
@endsection


@section('content')
    <p>Notamos que você realizou o cadastro, mas ainda não efetivou a sua participação!</p>
    <p>Você pode concluir o pagamento e participar do sorteio, acessando <b><a
                href="{{ route('api.stripe.retrieve', ['encryptedEncodedData' => $encryptedEncodedData]) }}">esse
                link</a></b></p>
    <p>Esperamos que tenha uma ótima experiência!</p>
@endsection
