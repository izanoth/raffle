import prisma from '../db.js';
import { generateTickets } from '../helpers/utils.js';

export const register = async (req, res) => {
    const { name, email, phone, cpf, units, terms } = req.body;

    if (!terms) return res.status(400).json({ error: 'Agreement required.' });
    if (!cpf) return res.status(400).json({ error: 'CPF/CNPJ required.' });

    try {
        const amount = parseFloat(units) * 1;
        const tickets = await generateTickets(parseInt(units));
        
        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone: phone.replace(/[^\d]+/g, ''),
                cpf: cpf.replace(/[^\d]+/g, ''),
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
