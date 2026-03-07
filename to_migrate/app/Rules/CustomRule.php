<?php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
class CustomRule implements Rule
{
    public function passes($attribute, $value)
    {
        // Implemente sua lógica de validação personalizada aqui
        return true; 
    }

    public function message()
    {
        //return 'O campo :attribute deve satisfazer o critério personalizado.';
    }
}