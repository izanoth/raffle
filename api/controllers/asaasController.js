import prisma from '../db.js';
import fetch from 'node-fetch';

const ASAAS_KEY = process.env.ASAAS_KEY;
const PIX_KEY = process.env.PIX_KEY;

// Forced to Production environment as requested
const BASE_URL = 'https://api.asaas.com/v3';

const CUS_ENDPOINT = `${BASE_URL}/customers`;
const STATIC_QR_ENDPOINT = `${BASE_URL}/pix/qrCodes/static`;

export const asyncAsaas = async (req, res) => {
    const { client_id, name, cpf, phone, amount } = req.body;
    try {
        // 1. Create/Retrieve Customer (still good to have for records, but we'll focus on the QR Code)
        console.log('Asaas: Creating customer for', name);
        const customerResponse = await fetch(CUS_ENDPOINT, {
            method: 'POST',
            headers: { 'access_token': ASAAS_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cpfCnpj: cpf, mobilePhone: phone, notificationDisabled: true })
        });

        // We'll proceed even if customer creation fails or already exists, 
        // as the main goal now is the static QR Code.
        let asaas_id = null;
        if (customerResponse.ok) {
            const customer = await customerResponse.json();
            asaas_id = customer.id;
        }
        
        // 2. Create Static QR Code for this specific amount
        console.log('Asaas: Generating static QR Code for', amount);
        const qrResponse = await fetch(STATIC_QR_ENDPOINT, {
            method: 'POST',
            headers: { 
                'access_token': ASAAS_KEY, 
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                addressKey: PIX_KEY,
                description: `Rifa do Ivan - Pedido ${client_id.toString().padStart(6, '0')}`,
                value: amount,
                allowsMultiplePayments: false
            })
        });

        if (!qrResponse.ok) {
            const errorText = await qrResponse.text();
            console.error('Asaas QR Error Status:', qrResponse.status);
            console.error('Asaas QR Error Body:', errorText);
            const err = new Error(`Asaas QR Code Generation Failed (${qrResponse.status}): ${errorText}`);
            err.status = qrResponse.status;
            throw err;
        }

        const qrData = await qrResponse.json();

        // Update client with customer asaas_id if available
        if (asaas_id) {
            await prisma.client.update({
                where: { id: parseInt(client_id) },
                data: { asaas_id: asaas_id }
            });
        }

        res.json({
            success: true,
            payload: qrData.payload,
            qrcode: qrData.encodedImage
        });
    } catch (error) {
        console.error('Asaas error:', error);
        res.status(error.status || 500).json({ 
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
    const payload = req.body;
    if (payload.event === 'PAYMENT_RECEIVED') {
        const paymentId = payload.payment.id;
        await prisma.client.updateMany({
            where: { asaas_id: paymentId },
            data: { paid: 1 }
        });
        res.json({ message: 'OK' });
    } else {
        res.json({ message: 'Ignored event' });
    }
};
