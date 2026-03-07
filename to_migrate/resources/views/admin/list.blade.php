@extends('layouts.admin')

@section('content')
    @php
        $admin = session('admin');
    @endphp
    <script>
        function update(list) {
            var option = list.value;

        }
    </script>
    <div class="row">
        <div class="col-md-8">
            <div class="container bg-light p-3">
                <h2>Status</h2>
                <table class="table">
                    
                </table>
            </div>
        </div>
        <div class="col-md-4">
            <div class="container bg-light p-3">
                <!--form>
                            <div class="form-group">
                                <select class="form-control" id="options" onchange="update(this)">
                                    <option value="All">All</option>
                                    <option value="To Retrive">To Retrive</option>
                                    <option value="Well Succeed">Well succeed</option>
                                </select>
                            </div>
                        </form-->
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8">
            <div class="container bg-light p-3">
                <h2></h2>
                <p></p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="container bg-light p-3">
                @if (isset($message))
                    {{ $message }}
                @endif
                <form>
                    <div class="form-group">
                        <a href="{{ route('admin.stripe.reinvite', ['id' => $toReinvite]) }}"
                            class="btn btn-success fresh-reinvites">Fresh Reinvites</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="container">
        Session: {{ session('admin') }}
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Created at</th>
                    <th>Updated at</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>CPF</th>
                    <th>Payment Intent</th>
                    <th>Amount</th>
                    <th>Paid</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->id }}</td>
                        <td>{{ $client->created_at }}</td>
                        <td>{{ $client->updated_at }}</td>
                        <td>{{ $client->name }}</td>
                        <td>{{ $client->email }}</td>
                        <td>{{ $client->phone }}</td>
                        <td>{{ $client->cpf }}</td>
                        @if ($client->asaas_id != null && $client->stripe_id == null)
                            <td>PIX</td>
                        @elseif ($client->asaas_id == null && $client->stripe_id != null)
                            <td>Card</td>
                        @elseif ($client->asaas_id != null && $client->stripe_id != null)
                            <td>Both</td>
                        @else
                            <td class="text-muted small">None</td>
                        @endif
                        <td>{{ $client->amount }}</td>
                        @if ($client->paid)
                            <td style="color:green">Yes</td>
                        @elseif (!$client->paid && $client->stripe_id != null)
                            <td><a href="{{ route('admin.stripe.reinvite', ['id' => $client->id]) }}"
                                    class="btn btn-primary">Reinvite</a></td>
                        @elseif (!$client->paid && $client->asaas_id != null)
                            <td>Developing</td>
                        @elseif (!$client->paid && $client->asaas_id != null && $client->stripe_id != null)
                            <td><a href="{{ route('admin.stripe.reinvite', ['id' => $client->id]) }}"
                                    class="btn btn-primary">Reinvite</a></td>
                        @else
                            <td></td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
