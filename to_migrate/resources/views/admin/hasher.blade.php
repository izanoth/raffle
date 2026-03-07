@extends('layouts.admin')

@section('content')
    @if (isset($hash))
        <p>{{ $hash }}</p>
    @endif

    <h2>BCrypt</h2>
    <form method="post" action="{{ route('admin.hash.generator') }}">
        @csrf
        <label for="senha">Senha:</label>
        <input type="password" name="password" required>
        <button type="submit" name="bcrypt">Gerar</button>
    </form>
    <a href="{{ route('admin.panel') }}"><i class="fa fa-arrow-circle-left"></i> Voltar</a>
@endsection
