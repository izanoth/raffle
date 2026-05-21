import prisma from '../db.js';

export const getStats = async (req, res) => {
    try {
        const registers = await prisma.client.count();
        const payments = await prisma.client.count({ where: { paid: 1 } });
        const asaasIntents = await prisma.client.count({ where: { asaas_id: { not: null }, paid: 0 } });
        
        res.json({ registers, payments, asaasIntents, totalIntents: asaasIntents });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' },
            include: { raffle: true }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const confirmPayment = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data: { paid: 1 }
        });
        res.json({ success: true, client });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const exportClientsCSV = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: { raffle: true },
            orderBy: { createdAt: 'desc' }
        });

        let csv = 'ID,Nome,Email,WhatsApp,Bilhetes,Valor,Pago,Rifa ID,Data\n';
        clients.forEach(c => {
            csv += `${c.id},"${c.name}","${c.email}",${c.phone},${c.units},${c.amount},${c.paid === 1 ? 'Sim' : 'Não'},${c.raffle?.number || 'N/A'},${c.createdAt.toISOString()}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=clientes_rifa.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRaffles = async (req, res) => {
    try {
        const raffles = await prisma.raffle.findMany({
            orderBy: { createdAt: 'desc' },
            include: { winner: true }
        });
        res.json(raffles);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createRaffle = async (req, res) => {
    const { title, prize, endDate } = req.body;
    try {
        // Calculate next number
        const count = await prisma.raffle.count();
        const nextNumber = (count + 1).toString().padStart(3, '0');

        const raffle = await prisma.raffle.create({
            data: {
                number: nextNumber,
                title,
                prize,
                endDate: endDate ? new Date(endDate) : null,
                status: 'ACTIVE'
            }
        });
        res.status(201).json(raffle);
    } catch (error) {
        console.error('Create raffle error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateRaffle = async (req, res) => {
    const { id } = req.params;
    const { number, title, prize, endDate, status, videoUrl } = req.body;
    try {
        const raffle = await prisma.raffle.update({
            where: { id: parseInt(id) },
            data: {
                number,
                title,
                prize,
                endDate: endDate ? new Date(endDate) : null,
                status,
                videoUrl
            }
        });
        res.json(raffle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteRaffle = async (req, res) => {
    return res.status(403).json({ error: 'Exclusão de rifas não é permitida. Elas devem permanecer registradas para histórico.' });
};

export const drawRaffle = async (req, res) => {
    const { id } = req.params;
    try {
        const raffle = await prisma.raffle.findUnique({
            where: { id: parseInt(id) },
            include: { clients: true }
        });

        if (!raffle) return res.status(404).json({ error: 'Raffle not found' });

        const paidClients = await prisma.client.findMany({
            where: { 
                paid: 1,
                raffleId: raffle.id
            }
        });

        if (paidClients.length === 0) {
            return res.status(400).json({ error: 'Nenhum pagamento confirmado para esta rifa.' });
        }

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

        const winnerIndex = Math.floor(Math.random() * allTickets.length);
        const winner = allTickets[winnerIndex];

        // Update raffle with winner and status
        await prisma.raffle.update({
            where: { id: raffle.id },
            data: {
                winnerId: winner.clientId,
                status: 'FINISHED',
                drawDate: new Date()
            }
        });

        res.json({ success: true, winner });
    } catch (error) {
        console.error('Error during draw:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleMaintenance = async (req, res) => {
    const { enabled } = req.body;
    try {
        const config = await prisma.config.upsert({
            where: { key: 'maintenance_mode' },
            update: { value: enabled ? 'true' : 'false' },
            create: { key: 'maintenance_mode', value: enabled ? 'true' : 'false' }
        });
        res.json({ success: true, maintenance: config.value === 'true' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMaintenanceStatus = async (req, res) => {
    try {
        const config = await prisma.config.findUnique({
            where: { key: 'maintenance_mode' }
        });
        res.json({ maintenance: config ? config.value === 'true' : false });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
