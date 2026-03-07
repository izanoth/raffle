<?php
// app/Models/Produto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    public function _construct() {
        
    }
    protected $table = 'clients';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'cpf',
        'stripe_id',
        'asaas_id',
        'tickets',
        'amount',
        'paid',
    ];
    protected $guarded = ['id'];
}
