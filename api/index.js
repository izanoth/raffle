import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './db.js';
import * as mainController from './controllers/mainController.js';
import * as asaasController from './controllers/asaasController.js';
import * as contactController from './controllers/contactController.js';
import * as adminController from './controllers/adminController.js';
import * as pushController from './controllers/pushController.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Maintenance Middleware
const maintenanceCheck = async (req, res, next) => {
    if (req.path.startsWith('/api/admin') || req.path === '/api/health' || req.path === '/api/app-state' || req.path === '/api/maintenance') {
        return next();
    }
    
    try {
        const config = await prisma.config.findUnique({
            where: { key: 'maintenance_mode' }
        });
        if (config && config.value === 'true') {
            return res.status(503).json({ error: 'Maintenance mode' });
        }
    } catch (error) {
        console.error('Maintenance check error:', error);
    }
    next();
};

app.use(maintenanceCheck);

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
app.get('/api/app-state', mainController.getAppState);
app.get('/api/raffle/status', mainController.getRaffleStatus);
app.get('/api/raffle/finished', mainController.getFinishedRaffle);
app.post('/api/contact', contactController.sendContact);

// Push Notifications (Public)
app.post('/api/push/subscribe', pushController.subscribe);
app.post('/api/push/unsubscribe', pushController.unsubscribe);

// Push Notifications (Admin)
app.get('/api/admin/push/subscriptions', pushController.getSubscriptions);
app.post('/api/admin/push/broadcast', pushController.broadcast);
app.post('/api/admin/push/test', pushController.sendReminder);

// Asaas/PIX Routes
app.post('/api/asaas', asaasController.asyncAsaas);
app.get('/api/asaas/polling', asaasController.polling);
app.post('/api/asaas/webhook', asaasController.webhook);

// Admin Routes
app.post('/api/admin/login', (req, res) => {
    const { user, password } = req.body;
    if (user === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        res.json({ token: 'mock-jwt-token', user });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/api/admin/stats', adminController.getStats);
app.get('/api/admin/clients', adminController.getClients);
app.get('/api/admin/clients/export', adminController.exportClientsCSV);
app.post('/api/admin/clients/:id/confirm-payment', adminController.confirmPayment);

// Raffle Management
app.get('/api/admin/raffles', adminController.getRaffles);
app.post('/api/admin/raffles', adminController.createRaffle);
app.put('/api/admin/raffles/:id', adminController.updateRaffle);
app.delete('/api/admin/raffles/:id', adminController.deleteRaffle);
app.post('/api/admin/raffles/:id/draw', adminController.drawRaffle);

// Maintenance Mode
app.get('/api/admin/maintenance', adminController.getMaintenanceStatus);
app.post('/api/admin/maintenance', adminController.toggleMaintenance);
app.get('/api/maintenance', adminController.getMaintenanceStatus);

// Export for Vercel
export default app;

// Listen for local testing
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
