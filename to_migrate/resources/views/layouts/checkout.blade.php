<!DOCTYPE html>

<head>
    <meta name="title" content="Rifart">
    <meta name="description" content="Sorteios digitais">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="sorteio online; sorteio; rifa; premio" />
    <meta name="author" content="Ivan">

    <!--Routes-->
    <meta name="success-route" content="{{ route('success', ['id' => $new_client->id]) }}">
    <meta name="asaas-route" content="{{ route('api.asaas') }}">
    <meta name="polling-route" content="{{ route('api.asaas.polling') }}">
    <meta name="get-secret-route" content="{{ route('api.asaas.getSecret') }}">
    <meta name="encrypted-data" content={{ $encodedEncryptedData }}>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css_app-8i3os-Xu.css') }}" />
    <script src="{{ asset('assets/jquery3.7.1.js') }}"></script>
    <script type="module" src="{{ asset('assets/js_checkout_app-HslGROsQ.js') }}"></script>
    <script>
        function payloadToClipboard() {
            document.getElementById('payload').innerHTML = '<i class="fa-solid fa-clipboard"></i> Copiado!';
            var payloadElement = document.getElementById('payload');
            payloadElement.querySelectorAll('i').setAttribute('class', 'fa-solid fa-clipboard');
        }
    </script>
</head>
<html>

<body>
    <!--Loader-->
    <div class="film"><i class="fas fa-times fas-pix btn-film-close"></i></div>
    <div class="startbox">
        <button id="payload"><i class="fa-solid fa-copy"></i> PIX Copia e Cola</button>
        <div id="qr">
            <div class="loading-qr"></div>
        </div>
    </div>
    <!--/Loader-->

    <div class="jumbotron">
        <h2>Falta pouco...</h2>
    </div>
    <div class="container">
        @yield('content')
    </div>

    <footer>
        <div class="d-flex flex-column text-center justify-content-center pt-5">
            <small>Dúvidas entrar em contato pelo e-mail contato@rifart.com.br</small>
            <img class="d-block ml-auto mr-auto" height="60px" width="auto"
                src="{{ asset('img/rifa.png') }}">
        </div>
    </footer>
</body>

</html>
