import prisma from '../db.js';
import { generateTickets } from '../helpers/utils.js';

export const register = async (req, res) => {
    const { name, email, phone, units, terms } = req.body;

    if (!terms) return res.status(400).json({ error: 'Agreement required.' });

    try {
        const amount = parseFloat(units) * 5;
        const tickets = await generateTickets(parseInt(units));
        
        // Find current active raffle
        const activeRaffle = await prisma.raffle.findFirst({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });

        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone: phone.replace(/[^\d]+/g, ''),
                units: parseInt(units),
                amount,
                tickets,
                paid: 0,
                raffleId: activeRaffle ? activeRaffle.id : null
            }
        });
        console.log('Client saved with tickets:', client);

        res.status(201).json(client);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFinishedRaffle = async (req, res) => {
    try {
        const raffle = await prisma.raffle.findFirst({
            where: { status: 'FINISHED' },
            orderBy: { drawDate: 'desc' },
            include: { winner: true }
        });
        res.json(raffle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAppState = async (req, res) => {
    try {
        const maintenance = await prisma.config.findUnique({
            where: { key: 'maintenance_mode' }
        });
        
        const activeRaffle = await prisma.raffle.findFirst({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });

        // Auto-assign clients without raffleId to the active raffle
        if (activeRaffle) {
            await prisma.client.updateMany({
                where: { raffleId: null },
                data: { raffleId: activeRaffle.id }
            });
        }

        const lastFinished = await prisma.raffle.findFirst({
            where: { status: 'FINISHED' },
            orderBy: { drawDate: 'desc' }
        });

        res.json({
            maintenance: maintenance ? maintenance.value === 'true' : false,
            hasActiveRaffle: !!activeRaffle,
            hasFinishedRaffle: !!lastFinished
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTimer = async (req, res) => {
    try {
        const raffle = await prisma.raffle.findFirst({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(raffle);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRaffleStatus = async (req, res) => {
    try {
        const activeRaffle = await prisma.raffle.findFirst({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });

        const where = { paid: 1 };
        if (activeRaffle) {
            where.raffleId = activeRaffle.id;
        }

        const clients = await prisma.client.findMany({
            where,
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
            where
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
            goal: 52,
            totalSold: totalSold._sum.units || 0,
            participantsCount: clients.length,
            participants: maskedClients
        });
    } catch (error) {
        console.error('Status fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
