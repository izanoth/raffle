@extends('layouts.emails')

@section('header')
    <h1 class="text-light">Agradecemos pela sua participação, {{ $name }}!</h1>
@endsection


@section('content')
    <p>Você já está concorrendo e iremos lhe informando!</p>
    <div class="container card w-50 d-flex flex-column justify-content-center">
        <div class="d-flex flex-row justify-content-between">
            <small>Nome: {{ $name }} </small>
            <small>Data :
                <?= now()->format('d/m/Y') ?>
            </small>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <p>Sorteio: 000000001</p>
        </div>
        <div class="d-flex flex-column justify-content-center">
            @foreach ($tickets as $item)
                <p>{{ $item }}</p>
            @endforeach
        </div>
    </div>
@endsection
