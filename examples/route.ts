import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const API_KEY = process.env.ASAAS_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, message: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = {
      addressKey: process.env.PIX_KEY, // Verifique se é válido
      description: 'donation',
    };

    const response = await fetch('https://api.asaas.com/v3/pix/qrCodes/static', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        access_token: API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API Asaas:', response.status, errorText);
      return NextResponse.json(
        { success: false, message: 'Erro na API Asaas', status: response.status, error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      encodedImage: data.encodedImage,
      payload: data.payload,
    });
  } catch (error) {
    console.error('Erro na API Asaas:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno no servidor',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

