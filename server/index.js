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

// Export for Vercel
export default app;

// Listen locally
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
