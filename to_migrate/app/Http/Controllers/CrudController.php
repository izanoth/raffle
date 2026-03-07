<?php
// app/Http/Controllers/MyController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use Exception;

class CrudController extends AdminController
{
    public function index()
    {
        return view('admin.crud.index');
    }
    public function create()
    {


        return view('admin.crud.create');
    }    
    public function store()
    {

    }
    public function show($id)
    {

    }
    public function edit($id)
    {

        return view('admin.crud.edit');
    }
    public function update($id)
    {

    }
    public function destroy($id)
    {
        
    }
}