@extends('layouts.admin')


@section('content')
    @php
        $admin = session('admin');
    @endphp
    <div class="container d-flex w-100 flex-column justify-content-center align-items-center">
        <div class="w-100">
            <style>
                .status-table td:nth-child(2) {
                    text-align: right;
                }
            </style>
            <table class=" table table-dark status-table">
                <thead>
                    <tr>
                      <th class="table-light text-dark" scope="col" colspan="2"><h2>Status</h2></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Registers</th>
                        <td>{{ $registers }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Payments</th>
                        <td>{{ $payments }}</td>
                    </tr>
                    <tr>
                        <th class="text-center table-light text-dark" colspan="2">Intents</th>
                    </tr>
                    <tr>
                        <th scope="row">Card</th>
                        <td>{{ $stripeIntents }}</td>
                    </tr>
                    <tr>
                        <th scope="row">PIX</th>
                        <td>{{ $asaasIntents }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Both</th>
                        <td>{{ $bothIntents }}</td>
                    </tr>
                    <tr>
                        <th class="table-info text-dark" scope="row">Total Intents</th>
                        <td>{{ $intents }}</td>
                    </tr>
            </table>
        </div>
        
        <div class="d-flex w-100 flex-row justify-content-between">
            <div class="">
                <a class="btn btn-primary" href="{{ route('admin.hasher', ['admin' => $admin]) }}">
                    Hash Generator</a>
            </div>
            <div class="">
                <a class="btn btn-primary" href="{{ route('admin.list', ['admin' => $admin]) }}">
                    Reinvite</a>
            </div>
            <div class="">
                <a class="btn btn-primary" href="{{ route('admin.telescope', ['admin' => $admin]) }}">
                    Telescope</a>
            </div>
            <!--div class="">
                <a class="btn btn-primary" href="{{ route('admin.crud.index', ['admin' => $admin]) }}">
                    CRUD</a-->
            </div>
        </div>
    </div>
@endsection
