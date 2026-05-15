import fetch from 'node-fetch';

export const sendContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Nome, e-mail e mensagem são obrigatórios.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = 'ivanzanoth@gmail.com';

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not defined');
        return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Rifa do Ivan <onboarding@resend.dev>', // Resend standard sender if domain not verified
                to: [TO_EMAIL],
                subject: `Contato: ${subject || 'Sem Assunto'} - ${name}`,
                html: `
                    <h2>Novo contato via Rifa do Ivan</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Assunto:</strong> ${subject || 'Sem Assunto'}</p>
                    <p><strong>Mensagem:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.json({ success: true, id: data.id });
        } else {
            console.error('Resend API error:', data);
            return res.status(500).json({ error: 'Erro ao enviar e-mail via Resend.' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Erro interno ao processar o contato.' });
    }
};
