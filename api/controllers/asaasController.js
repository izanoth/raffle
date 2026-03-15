import prisma from '../db.js';
import fetch from 'node-fetch';

const ASAAS_KEY = process.env.ASAAS_KEY;
const PIX_KEY = process.env.PIX_KEY;

// Forced to Production environment as requested
//const BASE_URL = 'https://api.asaas.com/v3';

//const CUS_ENDPOINT = `${BASE_URL}/customers`;
const CUS_ENDPOINT = process.env.ASAAS_CUS_ENDPOINT;
const STATIC_QR_ENDPOINT = process.env.ASAAS_STATIC_QR_ENDPOINT;

export const asyncAsaas = async (req, res) => {
    const { client_id, name, amount } = req.body;
    try {
        // 1. Create Static QR Code for this specific amount
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

        // Update client with the QR code ID to flag as PIX intention
        await prisma.client.update({
            where: { id: parseInt(client_id) },
            data: { asaas_id: qrData.id || 'PIX_STATIC' }
        });

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
        const pixQrCodeId = payload.payment.pixQrCodeId;
        const description = payload.payment.description || '';
        
        console.log(`Processing payment ${paymentId}. PixQrCodeId: ${pixQrCodeId}. Description: ${description}`);

        // 1. Try to match by asaas_id (matches our saved pixQrCodeId)
        let updated = { count: 0 };
        const idToMatch = pixQrCodeId || paymentId;
        
        if (idToMatch) {
             updated = await prisma.client.updateMany({
                where: { asaas_id: idToMatch },
                data: { paid: 1 }
            });
        }

        // 2. If not found, try to extract client ID from description (new static QR approach)
        // Description format: "Rifa do Ivan - Pedido 000123"
        if (updated.count === 0) {
            const match = description.match(/Pedido (\d+)/);
            if (match) {
                const clientId = parseInt(match[1]);
                console.log(`Found Client ID ${clientId} in description. Updating status...`);
                try {
                    await prisma.client.update({
                        where: { id: clientId },
                        data: { paid: 1 }
                    });
                    console.log(`Client ${clientId} marked as paid via description match.`);
                } catch (e) {
                    console.error(`Failed to update client ${clientId}:`, e.message);
                }
            } else {
                console.log('No Pedido ID found in description.');
            }
        } else {
            console.log(`Payment ${paymentId} updated via asaas_id match.`);
        }
        
        res.json({ message: 'OK' });
    } else {
        res.json({ message: 'Ignored event' });
    }
};
