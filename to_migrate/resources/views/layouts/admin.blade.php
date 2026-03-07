<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rifart ADM</title>
    <link href="{{ asset('assets/bootstrap_admin.css') }}" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>

    <!-- Cabeçalho -->
    <header class="bg-dark text-light py-3">
        <div class="container d-flex justify-content-between align-items-center">

            <img src="{{ asset('img/znt1.png') }}" alt="Zanoth" height="20" width="auto">

            @if (session()->has('admin'))
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-bars"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.hasher') }}">
                                Hash Generator</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="{{ route('admin.list') }}">
                                Reinvite</a>
                        </li>
                        <li class="">
                            <div class="d-flex flex-row align-items-center dropdown-item">
                                <img class="" height="20" src="{{ asset('img/telescope.svg') }}">
                                <a class="dropdown-item" href="{{ route('admin.telescope') }}">
                                    Telescope</a>
                            </div>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                            </hr>
                        </li>
                        <!--a class="btn btn-primary" href="{{ route('admin.crud.index') }}">
                                    CRUD</a-->
                        <li><a class="dropdown-item" href="{{ route('admin.logout') }}">Log out</a>
                        </li>
                    </ul>
                </div>
            @else
                <div></div>
            @endif

        </div>
        </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="py-4">
        <div class="container">
            @yield('content')
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-dark text-light py-3 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    @if (session()->has('admin'))
                        <form action="{{ route('admin.logout') }}" method="GET">
                            @csrf
                            <button type="submit" class="btn btn-danger">Logout</button>
                        </form>
                    @endif
                </div>
            </div>
        </div>
    </footer>
    <!--script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"-->
    </script>
</body>

</html>
