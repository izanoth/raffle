export function validateCpf(cpf) {
    if (!cpf) return false;
    
    const cleanCpf = cpf.replace(/\D/g, "");

    // CPF must have exactly 11 digits and not be all identical digits
    if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
    }

    let sum = 0;
    let remainder;

    // Validate first digit
    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cleanCpf.substring(9, 10))) {
        return false;
    }

    // Validate second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    if (remainder !== parseInt(cleanCpf.substring(10, 11))) {
        return false;
    }

    return true;
}

export function maskCpf(value) {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

export function maskPhone(value) {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
}

export async function registerPush(email = null) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            const publicKey = 'BObBw4dnXBi2hyVyLXLHiULwJtsnVG2cRaGQLRBUkdsOCYAKa8QBTR1wfNFDo_uRXAI2qF-DkkLp_C1ko8XfSUQ';
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });
        }

        await saveSubscription(subscription, email);
    } catch (error) {
        console.error('Push registration failed:', error);
    }
}

export async function unregisterPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // Remove do banco antes de cancelar no browser para ter o endpoint
            await fetch('/api/push/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: subscription.endpoint })
            });
            
            await subscription.unsubscribe();
            console.log('Unsubscribed successfully');
        }
    } catch (error) {
        console.error('Push unregistration failed:', error);
    }
}

async function saveSubscription(subscription, email) {
    await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, email })
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
