<!DOCTYPE html>

<head>
    <meta name="title" content="Rifart">
    <meta name="description" content="Sorteios digitais">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="" />
    <meta name="author" content="ivan">
    <meta name="onceSucceeded-route" content="{{ route('admin.stripe.succeeded') }}">

    <meta name="success-route" content="{{ route('success', ['id' => '']) }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('assets/css_stripe-VrFDHJm-.css') }}" />
    <script src="{{ asset('assets/jquery3.7.1.js') }}"></script>
    <script src="https://js.stripe.com/v3/"></script>
</head>
<html>

<body>

    <body>
        <div id="bk" style="width:100%;height:100%;position:fixed">
        </div>



        <div class="sr-root">
            <div class="sr-main">
                <section class="container">
                    @if (Route::currentRouteName() == 'api.stripe.retrieve')
                        <div style="padding:10px">
                        Bem-vindo(a) de volta, <b>{{ json_decode($name)[0]->name }}</b>!
                        </div>
                        @endif
                    <img id="rifalogo" src="{{ asset('img/rifa.png') }}" width="320" height="auto">
                    <form id="payment-form" data-secret="{{ $clientSecret }}">
                        <!-- Display a payment form -->
                        <div class="payment-element form">
                            <label for="cardnum">Número do Cartão de Crédito: </label>
                            <div id="cardnum">
                            </div>

                            <label for="cardexp">Vencimento: </label>
                            <div id="cardexp">
                            </div>

                            <label for="cardcvc">Código de Segurança: </label>
                            <div id="cardcvc">
                            </div>
                            <button id="submit" disabled>
                                <div class="spinner hidden" id="spinner"></div>
                                <span id="button-text">Pagar agora</span>
                            </button>
                            <input type="hidden" name="id" value="{{ $client_id }}" />
                            <!--Input value=id injected by charge.php-->
                        </div>
                        <div class="payment-message status"></div>
                    </form>
                    <div style="padding-bottom:23px;position:relative;" class="top">
                        <img style="position:absolute;right:0px;vertical-align:bottom"
                            src="{{ asset('img/stripesecure.png') }}">
                    </div>
                </section>
                <div id="error-message"></div>
            </div>
        </div>
    </body>

</html>

<script type="text/javascript">
    const stripe = Stripe("{{ config('services.stripe.public') }}");
</script>
<script src="{{ asset('assets/js_stripe_app-1EOi0Jad.js') }}" defer></script>
