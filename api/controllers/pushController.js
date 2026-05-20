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

    try {
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                email: email || null
            },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                email: email || null,
                participated: false
            }
        });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Push subscription error:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
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
