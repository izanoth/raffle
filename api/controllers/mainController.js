import prisma from '../db.js';
import { generateTickets } from '../helpers/utils.js';

export const register = async (req, res) => {
    const { name, email, phone, units, terms } = req.body;

    if (!terms) return res.status(400).json({ error: 'Agreement required.' });

    try {
        const amount = parseFloat(units) * 5;
        const tickets = await generateTickets(parseInt(units));
        
        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone: phone.replace(/[^\d]+/g, ''),
                units: parseInt(units),
                amount,
                tickets,
                paid: 0
            }
        });
        console.log('Client saved with tickets:', client);

        res.status(201).json(client);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTimer = async (req, res) => {
    try {
        const raffle = await prisma.raffle.findFirst();
        res.json(raffle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRaffleStatus = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { paid: 1 },
            select: {
                email: true,
                phone: true,
                units: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalSold = await prisma.client.aggregate({
            _sum: {
                units: true
            },
            where: { paid: 1 }
        });

        const maskedClients = clients.map(c => {
            // Mask email: first 4 and last 4
            let maskedEmail = c.email;
            if (c.email.length > 8) {
                maskedEmail = c.email.substring(0, 4) + '...' + c.email.substring(c.email.length - 4);
            }

            // Mask phone: last 4 only
            const maskedPhone = '****' + c.phone.substring(c.phone.length - 4);

            return {
                email: maskedEmail,
                phone: maskedPhone,
                units: c.units,
                date: c.createdAt
            };
        });

        res.json({
            goal: 500,
            totalSold: totalSold._sum.units || 0,
            participantsCount: clients.length,
            participants: maskedClients
        });
    } catch (error) {
        console.error('Status fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
