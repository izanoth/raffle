import webpush from 'web-push';
import prisma from '../db.js';

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export const subscribe = async (req, res) => {
    const { subscription, email } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                email: email || null,
                userAgent,
                ip
            },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                email: email || null,
                participated: false,
                userAgent,
                ip
            }
        });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Push subscription error:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
};

export const unsubscribe = async (req, res) => {
    const { endpoint } = req.body;
    try {
        await prisma.pushSubscription.deleteMany({
            where: { endpoint }
        });
        res.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
};

export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const sendReminder = async (req, res) => {
    // Apenas para teste manual ou via Admin futuramente
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { participated: false }
        });

        const notifications = subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };

            return webpush.sendNotification(pushConfig, JSON.stringify({
                title: 'Lembrete da Rifa!',
                body: 'Ainda dá tempo de participar. O sorteio está chegando!',
                url: '/'
            })).catch(err => {
                if (err.statusCode === 410) {
                    // Subscription expired/removed
                    return prisma.pushSubscription.delete({ where: { id: sub.id } });
                }
                console.error('Error sending push:', err);
            });
        });

        await Promise.all(notifications);
        res.json({ success: true, count: subscriptions.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const broadcast = async (req, res) => {
    const { title, body, filter } = req.body;

    try {
        const where = {};
        if (filter === 'non-participated') {
            where.participated = false;
        } else if (filter === 'participated') {
            where.participated = true;
        }

        const subscriptions = await prisma.pushSubscription.findMany({ where });

        const notifications = subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };

            return webpush.sendNotification(pushConfig, JSON.stringify({
                title: title || 'Rifa do Ivan',
                body: body || 'Olá! Temos novidades no sorteio.',
                url: '/'
            })).catch(err => {
                if (err.statusCode === 410) {
                    return prisma.pushSubscription.delete({ where: { id: sub.id } });
                }
                console.error('Error sending broadcast push:', err);
            });
        });

        await Promise.all(notifications);
        res.json({ success: true, count: subscriptions.length });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({ error: 'Failed to send broadcast' });
    }
};
