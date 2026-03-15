import prisma from '../db.js';
import fetch from 'node-fetch';

const ASAAS_KEY = process.env.ASAAS_KEY;

// Endpoints vindos do .env
const CUS_ENDPOINT = process.env.ASAAS_CUS_ENDPOINT;
const PAY_ENDPOINT = process.env.ASAAS_PAY_ENDPOINT;
const QR_ENDPOINT = process.env.ASAAS_QR_ENDPOINT;

export const asyncAsaas = async (req, res) => {
    const { client_id, name, cpf, phone, amount } = req.body;
    
    try {
        // 1. Criar ou Atualizar Cliente (notificationDisabled: true)
        console.log('Asaas: Criando/buscando cliente para', name);
        const customerResponse = await fetch(CUS_ENDPOINT, {
            method: 'POST',
            headers: { 'access_token': ASAAS_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                cpfCnpj: cpf, 
                mobilePhone: phone,
                notificationDisabled: true 
            })
        });

        if (!customerResponse.ok) {
            const errorText = await customerResponse.text();
            throw new Error(`Erro na criação do cliente Asaas: ${errorText}`);
        }

        const customer = await customerResponse.json();
        
        // 2. Criar Cobrança Dinâmica (PIX)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1); // Vencimento para amanhã
        
        console.log('Asaas: Gerando cobrança para cliente', customer.id);
        const paymentResponse = await fetch(PAY_ENDPOINT, {
            method: 'POST',
            headers: { 'access_token': ASAAS_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: customer.id,
                billingType: 'PIX',
                value: amount,
                dueDate: dueDate.toISOString().split('T')[0],
                description: `Rifa do Ivan - Pedido ${client_id.toString().padStart(6, '0')}`,
                externalReference: client_id.toString()
            })
        });

        if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            throw new Error(`Erro na criação da cobrança Asaas: ${errorText}`);
        }

        const payment = await paymentResponse.json();

        // 3. Obter QR Code Dinâmico
        console.log('Asaas: Buscando QR Code para pagamento', payment.id);
        const qrResponse = await fetch(QR_ENDPOINT.replace('{id}', payment.id), {
            headers: { 'access_token': ASAAS_KEY }
        });

        if (!qrResponse.ok) {
            const errorText = await qrResponse.text();
            throw new Error(`Erro na geração do QR Code: ${errorText}`);
        }

        const qrData = await qrResponse.json();

        // Atualizar o cliente no banco com o ID da cobrança para o webhook
        await prisma.client.update({
            where: { id: parseInt(client_id) },
            data: { asaas_id: payment.id }
        });

        res.json({
            success: true,
            payload: qrData.payload,
            qrcode: qrData.encodedImage,
            paymentId: payment.id
        });

    } catch (error) {
        console.error('Erro Asaas Flow:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

export const polling = async (req, res) => {
    const { id } = req.query;
    try {
        const client = await prisma.client.findUnique({ where: { id: parseInt(id) } });
        res.json({ confirmed: client?.paid === 1 });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const webhook = async (req, res) => {
    // Security check: Validate the webhook token sent by Asaas
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
    const receivedToken = req.headers['asaas-access-token'];

    if (webhookToken && receivedToken !== webhookToken) {
        console.warn('Asaas Webhook: Unauthorized access attempt with invalid token.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    console.log('Asaas Webhook received:', payload.event);

    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
        const paymentId = payload.payment.id;
        const externalReference = payload.payment.externalReference;
        
        console.log(`Processing payment ${paymentId}. ExternalReference: ${externalReference}`);

        // 1. Try to match by asaas_id
        const updated = await prisma.client.updateMany({
            where: { asaas_id: paymentId },
            data: { paid: 1 }
        });

        // 2. If not found by ID, try by externalReference (client_id)
        if (updated.count === 0 && externalReference) {
            const clientId = parseInt(externalReference);
            try {
                await prisma.client.update({
                    where: { id: clientId },
                    data: { paid: 1 }
                });
                console.log(`Client ${clientId} marked as paid via externalReference.`);
            } catch (e) {
                console.error(`Failed to update client ${clientId}:`, e.message);
            }
        }
        
        res.json({ message: 'OK' });
    } else {
        res.json({ message: 'Ignored event' });
    }
};
