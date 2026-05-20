import prisma from '../db.js';
import webpush from 'web-push';

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export default async function handler(req, res) {
    // Proteção básica para garantir que só o sistema de Cron chame esta URL
    // Na Vercel, você pode usar CRON_SECRET se desejar
    
    try {
        const activeRaffle = await prisma.raffle.findFirst({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });

        if (!activeRaffle) {
            return res.status(200).json({ message: 'No active raffle' });
        }

        const subscriptions = await prisma.pushSubscription.findMany({
            where: { participated: false }
        });

        const notifications = subscriptions.map(sub => {
            return webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            }, JSON.stringify({
                title: 'Ainda dá tempo! 🍀',
                body: `O sorteio "${activeRaffle.title}" está chegando. Garanta sua participação!`,
                url: '/'
            })).catch(async err => {
                if (err.statusCode === 410 || err.statusCode === 401) {
                    await prisma.pushSubscription.delete({ where: { id: sub.id } });
                }
            });
        });

        await Promise.all(notifications);
        res.status(200).json({ sent: subscriptions.length });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ error: error.message });
    }
}
