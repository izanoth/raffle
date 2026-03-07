<!DOCTYPE html>
<html>

<meta property="og:title" content="Rifart">
<meta property="og:description" content="Participe e concorra a produtos de qualidade">
<meta property="og:url" content="https://www.rifart.com.br">
<meta property="og:image" content="https://www.rifart.com.br/img/rifa.png">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@zanoth4">
<meta name="twitter:title" content="Rifart">
<meta name="twitter:description" content="Participe e concorra a Galaxy Book 2!">
<meta name="twitter:image" content="https://rifart.com.br/img/rifa.png">

<meta property="og:title" content="Título da sua Página no LinkedIn">
<meta property="og:description" content="Descrição da sua Página no LinkedIn">
<meta property="og:url" content="URL da sua Página no LinkedIn">
<meta property="og:image" content="https://rifart.com.br/img/rifa.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rfiart">

<meta name="title" content="Rifart">
<meta name="description" content="Sorteios digitais">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="keywords" content="" />
<meta name="author" content="Ivan Cilento">

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css_app-8i3os-Xu.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
    <script src="{{ asset('assets/jquery3.7.1.js') }}"></script>
    <script src="https://unpkg.com/imask@6.4.2/dist/imask.js"></script>
    <script src="{{ asset('assets/imask_call.js') }}"></script>
    <script type="module" src="{{ asset('assets/js_app-ut2Moiq1.js') }}"></script>
    <script src="{{ asset('assets/infoup.js') }}"></script>
 
</head>
</head>

<body>
    <!--Contract-->
    <div class="film"></div>
    <div class="contract container" style="display:none">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Contrato Digital de Participação em Rifart
                    <i class="fas fa-times fas-contract btn-film-close"></i></div>
                    <div class="card-body">
                        <iframe src="{{ asset('includes/contract.html') }}" style="width:100%; height:300px;"></iframe>
                    </div>
                    <div class="card-footer">
                        <div class="form-group form-check">
                            <input type="checkbox" class="contract-checkbox" id="agreeCheck">
                            <label class="form-check-label" for="agreeCheck">Concordo com os termos e condições do
                                contrato</label>
                        </div>
                        <button type="button" class="btn btn-primary text-light btn-participate btn-film-close" id="agreeButton" disabled>Concordo</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--/Contract-->
    <div class="container card">
        <div class="container">
            @yield('index.header')
            @yield('index.announce')
        </div>
        <div class="card-body bg-primary text-light">
            @yield('index.form')
        </div>
        <div class="container">
            @yield('index.footer')
            @yield('index.partners')
        </div>
    </div>
</body>

</html>
