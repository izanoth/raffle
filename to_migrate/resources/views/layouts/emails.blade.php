<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-mail template</title>
    <link href="{{ asset('assets/css_app-8i3os-Xu.css') }}" rel="stylesheet">
    <style>
        body {
            background-color: white;
        }
    </style>
</head>

<body>

    <!-- Cabeçalho -->

    <div class="container card py-5">
        <div class="card-header bg-primary py-3">
            @yield('header')
        </div>
        <div class="card-body py-4">
            @yield('content')
        </div>
        <div class="card-footer py-3 text-dark d-flex flex-column align-items-center justify-content-center">
            <p>Equipe Rifart</p>
            <img src="{{ asset('img/rifa.png') }}" alt="Rifart" height="50" width="auto">
        </div>
    </div>


</body>

</html>
