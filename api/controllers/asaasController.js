import prisma from '../db.js';
import fetch from 'node-fetch';

const ASAAS_KEY = process.env.ASAAS_KEY;
const CUS_ENDPOINT = process.env.ASAAS_CUS_ENDPOINT || 'https://sandbox.asaas.com/api/v3/customers';
const PAY_ENDPOINT = process.env.ASAAS_PAY_ENDPOINT || 'https://sandbox.asaas.com/api/v3/payments';
const QR_ENDPOINT = process.env.ASAAS_QR_ENDPOINT || 'https://sandbox.asaas.com/api/v3/payments/{id}/pixQrCode';

export const asyncAsaas = async (req, res) => {
    const { client_id, name, cpf, phone, amount } = req.body;
console.log('endpoint: ', CUS_ENDPOINT);
    try {
        // 1. Create Customer
        console.log('Asaas: Creating customer for', name);
        const customerResponse = await fetch(CUS_ENDPOINT, {
            method: 'POST',
            headers: { 'access_token': ASAAS_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, cpfCnpj: cpf, mobilePhone: phone })
        });

        if (!customerResponse.ok) {
            const errorText = await customerResponse.text();
            console.error('Asaas Customer Error Status:', customerResponse.status);
            console.error('Asaas Customer Error Body:', errorText);
            throw new Error(`Asaas Customer Creation Failed (${customerResponse.status})`);
        }

        const customer = await customerResponse.json();
        
        // 2. Create Payment (PIX)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 2);
        
        console.log('Asaas: Creating payment for customer', customer.id);
        const paymentResponse = await fetch(PAY_ENDPOINT, {
            method: 'POST',
            headers: { 'access_token': ASAAS_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: customer.id,
                billingType: 'PIX',
                value: amount,
                dueDate: dueDate.toISOString().split('T')[0],
                cpfCnpj: cpf // Added CPF/CNPJ here
            })
        });

        if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            console.error('Asaas Payment Error Status:', paymentResponse.status);
            console.error('Asaas Payment Error Body:', errorText);
            throw new Error(`Asaas Payment Creation Failed (${paymentResponse.status})`);
        }

        const payment = await paymentResponse.json();

        // 3. Get QR Code
        console.log('Asaas: Getting QR Code for payment', payment.id);
        const qrResponse = await fetch(QR_ENDPOINT.replace('{id}', payment.id), {
            headers: { 'access_token': ASAAS_KEY }
        });

        if (!qrResponse.ok) {
            const errorText = await qrResponse.text();
            console.error('Asaas QR Error Status:', qrResponse.status);
            console.error('Asaas QR Error Body:', errorText);
            throw new Error(`Asaas QR Code Generation Failed (${qrResponse.status})`);
        }

        const qrData = await qrResponse.json();

        // Update client with asaas_id
        await prisma.client.update({
            where: { id: parseInt(client_id) },
            data: { asaas_id: payment.id }
        });

        res.json({
            success: qrData.success,
            payload: qrData.payload,
            qrcode: qrData.encodedImage
        });
    } catch (error) {
        console.error('Asaas error:', error);
        res.status(500).json({ error: error.message });
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
