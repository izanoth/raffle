@extends('layouts.admin')

@section('content')
    <div class="d-flex flex-column justify-content-center align-items-center">
        <h2>Adm</h2>
        <form class="form-group" action="{{ route('admin.authenticate') }}" method="post">
            @csrf
            <input class="form-control" style="color:white;background-color:grey" type="text" name="admin" />
            <input class="form-control" style="color:white;background-color:grey" type="password" name="password" />
            <button class="form-control btn btn-default" style="background-color:black;color:white" type="submit"
                name="auth">Acessar</button>
            @if ($errors->any())
                <div class="alert alert-danger">
                    Credenciais inválidas.
                </div>
            @endif
        </form>
    </div>
@endsection
