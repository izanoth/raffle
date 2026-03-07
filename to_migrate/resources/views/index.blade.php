    @extends('layouts.index')

    @section('index.header')
    <div class="d-flex flex-column">
        <div class="col-md-6">
            <img id="rifalogo" class="img-fluid" src="{{ asset('img/rifa.png') }}">
        </div>
        <div class="col-md-6">
            <div class="d-flex flex-column justify-content-center">
                <p>Encerramento do sorteio em <br>
                <b id="timer">
                </b></p>
            </div>
        </div>
    @endsection

    @section('index.announce')
        <p class="announce mt-4">Você estará concorrendo a um <a
                href="https://www.samsung.com/br/computers/samsung-book/galaxy-book2-15inch-i5-8gb-256gb-np550xed-kf4br/"
                target="_blank"><img src='{{ asset('img/galaxybook2.png') }}' height="35" width="auto"></a>
        </p>
    @endsection

    @section('index.form')
        <div style="padding:20px">
            <form action="{{ route('validate') }}" method="post">
                @csrf
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center ">
                        <label for="name">Nome:</label>
                    </div>
                    <div class="col-md-8 d-flex align-items-center justify-content-center">
                        <input class="form-control @error('name') is-invalid @enderror" type="text" name="name"
                            value="@error('name') {{ '' }} @else {{ old('name') }} @enderror"
                            placeholder="@error('name') {{ 'Insira um nome válido.' }} @enderror" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center ">
                        <label for="email">E-mail:</label>
                    </div>
                    <div class="col-md-8 d-flex align-items-center justify-content-center">
                        <input class="form-control @error('email') is-invalid @enderror" type="text" name="email"
                            value="@error('email') {{ '' }} @else {{ old('email') }} @enderror"
                            placeholder="@error('email') Insira um e-mail válido. @enderror" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center ">
                        <label for="cpf">CPF:</label>
                    </div>
                    <div class="col-md-8 d-flex align-items-center justify-content-center">
                        <input id="cpf" class="form-control @error('cpf') is-invalid @enderror" type="text"
                            name="cpf" value="@error('cpf') {{ '' }} @else {{ old('cpf') }} @enderror"
                            placeholder="@error('cpf') Insira um número de CPF válido. @enderror" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center ">
                        <label for="phone">Celular <img src=""> :</label>
                    </div>
                    <div class="col-md-8 d-flex align-items-center justify-content-center">
                        <input id="phone" class="form-control @error('phone') is-invalid @enderror" type="text"
                            name="phone" value="{{ old('phone') }}"
                            placeholder="@error('phone') Insira um número de telefone válido. @enderror" />
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="units">Quantidade:</label>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <div class="input-root inline-group d-flex ml-2">
                            <div class="input-prepend align-middle align-self-center">
                                <div class="btn btn-minus align-middle align-self-center cursor-pointer">
                                    <i class="fa fa-minus"></i>
                                </div>
                            </div>
                            <input id="units" class="form-control align-middle align-self-center" min="1"
                                name="units" value="1" type="number">
                            <div class="input-append align-middle align-self-center">
                                <div class="btn btn-plus align-middle align-self-center cursor-pointer">
                                    <i class="fa fa-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <div id="result" class="result-value">R$ <strong
                                style="font-size:26px;">5</strong>,<small>00</small></div>

                    </div>

                </div>
                <div class="row onceFirsts">
                    <div class="col d-flex justify-content-center">
                        <div class="mb-4 px-4">
                            <img src="{{ asset('img/pix.png') }}" height="35" style="filter:invert(0.8);"
                                alt="PIX">
                        </div>
                        <div class="mb-4 px-4">
                            <img src="{{ asset('img/visamasterflags.png') }}" height="35" alt="Visa/MasterCard">
                        </div>
                    </div>
                </div>
                @error('terms')
                    <p class="text-secondary">Você deve aceitar os Termos e Condições</p>
                @enderror
                <div class="rules">
                    <span>Leia as </span><span id="btn-rules" onclick="infoup('{{ asset('includes/rules.html') }}')"
                        type="button">Regras
                        Gerais
                        da Rifa</span>
                </div>
                <div class="d-flex flex-row align-items-center"><input class="contract-checkbox" type="checkbox" name="terms" value="1"/> <span class="pl-2">Eu concordo com os <b id="contract">Termos e Condições do Contrato</b></span>
                </div>
                <input class="btn btn-secondary btn-large btn-participate btn-film-close" id="btn-participate" type="submit" name="submit"
                    value="Participar"  disabled/>
            </form>
        </div>
    @endsection

    @section('index.footer')
        <div class="row d-flex justify-content-md-between flex-column flex-md-row">
            <div class="col-md-6 me-auto p-2 text-center text-md-left text-muted">
                <p class="text-dark">&reg 2024 Projeto Rifart. <br>Todos os direitos reservados.</p>
            </div>
            <div class="col-md-6 ms-auto pb-4 p-md-2 text-center text-md-right text-muted small">
                <p class="text-dark">Developed by<br>
                    <img src="img/znt1.png" width="auto" height="15px;">
                </p>
            </div>
        </div>
    @endsection

    @section('index.partners')
        <div class="row d-flex flex-direction-row">
            <div class="col text-center">
                <img style="filter:invert:(1)" src="https://laravel.com/img/logomark.min.svg" Alt="Laravel">
            </div>
            <div class="col text-center">
                <img height="50" src="{{ asset('img/sslsecure.png') }}" Alt="SSL Secure Encryption">
            </div>
        </div>
        <div class="row d-flex">
            <div class="col text-center justify-content-center">
                <p class="small text-dark">Hosted by<br>
                    <img height="15" src="https://es.logodownload.org/wp-content/uploads/2019/09/hostgator-logo-41.png"
                        Alt="Hosted by Hostgator">
                </p>
            </div>
        </div>
    @endsection
