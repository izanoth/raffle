import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './db.js';
import * as mainController from './controllers/mainController.js';
import * as asaasController from './controllers/asaasController.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check for production
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Main Routes
app.post('/api/register', mainController.register);
app.get('/api/timer', mainController.getTimer);
app.get('/api/raffle/status', mainController.getRaffleStatus);

// Asaas/PIX Routes
app.post('/api/asaas', asaasController.asyncAsaas);
app.get('/api/asaas/polling', asaasController.polling);
app.post('/api/asaas/webhook', asaasController.webhook);

// Admin Routes (Simplified for demonstration)
app.post('/api/admin/login', (req, res) => {
    const { user, password } = req.body;
    if (user === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        res.json({ token: 'mock-jwt-token', user });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    // Check for auth header in real app
    const registers = await prisma.client.count();
    const payments = await prisma.client.count({ where: { paid: 1 } });
    const asaasIntents = await prisma.client.count({ where: { asaas_id: { not: null }, paid: 0 } });
    
    res.json({ registers, payments, asaasIntents, totalIntents: asaasIntents });
});

app.get('/api/admin/clients', async (req, res) => {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
});

app.post('/api/admin/clients/:id/confirm-payment', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: { paid: 1 }
        });
        res.json({ success: true, client });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/draw', async (req, res) => {
    try {
        const paidClients = await prisma.client.findMany({
            where: { paid: 1 }
        });

        if (paidClients.length === 0) {
            return res.status(400).json({ error: 'Nenhum pagamento confirmado para realizar o sorteio.' });
        }

        // Collect all tickets from paid clients
        let allTickets = [];
        paidClients.forEach(client => {
            try {
                const tickets = JSON.parse(client.tickets);
                tickets.forEach(ticket => {
                    allTickets.push({ ticket, clientId: client.id, name: client.name, email: client.email, phone: client.phone });
                });
            } catch (e) {
                console.error('Error parsing tickets for client', client.id);
            }
        });

        if (allTickets.length === 0) {
            return res.status(400).json({ error: 'Nenhum bilhete válido encontrado.' });
        }

        // Pick a random ticket
        const winnerIndex = Math.floor(Math.random() * allTickets.length);
        const winner = allTickets[winnerIndex];

        res.json({ success: true, winner });
    } catch (error) {
        console.error('Error during draw:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export for Vercel
export default app;

// Listen for local testing
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
