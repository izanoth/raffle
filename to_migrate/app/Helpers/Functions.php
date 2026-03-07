<?php

namespace App\Helpers;

class Functions
{
    public static function encryptAndCodingData($Data)
    {
        $keysPath = storage_path('keys');
        $pubKeyPath = $keysPath . '/public_key.pem';
        $pubKeyContents = file_get_contents($pubKeyPath);
        $publicKey = openssl_pkey_get_public($pubKeyContents);
        openssl_public_encrypt($Data, $encryptedData, $publicKey);
        $encodedEncryptedData = base64_encode($encryptedData);
        return $encodedEncryptedData;
    }

    public static function decodingAndCryptingData($encodedEncryptedData)
    {   
        $keysPath = storage_path('keys');
        $privKeyPath = $keysPath . '/private_key.pem';
        $privKeyContents = file_get_contents($privKeyPath);
        $privateKey = openssl_pkey_get_private($privKeyContents);
        $encryptedData = base64_decode($encodedEncryptedData);
        openssl_private_decrypt($encryptedData, $decryptedData, $privateKey);
        $strData = $decryptedData;
        return $strData;
    }

    /**
     * CPF VALIDATOR
     */
    public static function validateCpf($param)
    {
        function gear($str, $strToMatch, $onceFirst)
        {
            if (!$onceFirst) {
                $substr = substr($str, 0, 9);
                $x = validatingDigit($substr);
                if ($x == substr($strToMatch, 9, 1)) {
                    $substr = substr($str, 0, 9) . substr($str, 9, 1);
                    return gear($substr, $strToMatch, true);
                } else {
                    return false;
                }
            } else {
                $substr = $str;
                $x = validatingDigit($substr);
                if ($x == substr($strToMatch, 10, 1)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function validatingDigit($str, $onceFirst = false)
        {
            $factor = strlen($str) + 1;
            $total = 0;
            for ($i = 0; $i < strlen($str); $i++) {
                $total += intval($str[$i]) * $factor--;
            }
            $rest = $total % 11;
            $x = ($rest == 10) ? 0 : abs(11 - $rest);
            return $x;
        }

        $param = preg_replace("/[^0-9]/", "", $param);
        if (strlen($param) == 11) {
            return gear($param, $param, false);
        } else {
            return false;
        }
    }
}
