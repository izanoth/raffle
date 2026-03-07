import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function Checkout() {
    const { route } = useLocation();
    const [client, setClient] = useState(null);
    const [showPix, setShowPix] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedClient = sessionStorage.getItem('new-client');
            if (!storedClient) {
                route('/');
                return;
            }
            setClient(JSON.parse(storedClient));
        }
    }, []);

    const handlePixPayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/asaas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: client.id,
                    name: client.name,
                    cpf: client.cpf, // Added CPF here
                    phone: client.phone,
                    amount: client.amount
                })
            });
            const data = await response.json();
            if (data.success) {
                setPixData(data);
                setShowPix(true);
                startPolling();
            } else {
                alert('Erro na geração do pagamento: ' + data.error);
            }
        } catch (error) {
            alert('Erro de conexão ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayInPerson = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('payInPerson', 'true');
        }
        route('/success');
    };

    const startPolling = () => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/asaas/polling?id=${client.id}`);
                const data = await response.json();
                if (data.confirmed) {
                    clearInterval(interval);
                    route('/success');
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000); 
    };

    if (!client) return <div class="window"><div class="window-body">Carregando dados do usuário...</div></div>;

    return (
        <div class="window">
            <div class="title-bar">
                <div class="title-bar-text">Pagamento - Rifa do Ivan</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">_</button>
                    <button aria-label="Maximize">口</button>
                    <button aria-label="Close" onClick={() => route('/')}>×</button>
                </div>
            </div>

            <div class="window-body">
                <div class="fieldset">
                    <span class="fieldset-label">Resumo do Pedido</span>
                    <p style={{ margin: '0', fontSize: '11px' }}>ID: {client.id.toString().padStart(6, '0')}</p>
                    <p style={{ margin: '5px 0', fontSize: '12px' }}>Usuário: <b>{client.name}</b></p>
                    <p style={{ margin: '0', fontSize: '12px', color: 'darkblue' }}>Valor Devido: R$ {client.amount.toFixed(2)}</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <p style={{ fontSize: '11px' }}>Selecione o método de pagamento para concluir:</p>
                    <button 
                        class="btn" 
                        onClick={handlePixPayment}
                        disabled={loading}
                        style={{ width: '200px', height: '40px', fontWeight: 'bold' }}
                    >
                        {loading ? 'Processando...' : 'Pagar via PIX'}
                    </button>
                    <button 
                        class="btn" 
                        onClick={handlePayInPerson}
                        style={{ width: '200px', height: '40px' }}
                    >
                        Pagar Pessoalmente
                    </button>
                </div>

                {showPix && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div class="window" style={{ maxWidth: '300px' }}>
                            <div class="title-bar">
                                <div class="title-bar-text">PIX Payment Information</div>
                                <div class="title-bar-controls">
                                    <button onClick={() => setShowPix(false)}>×</button>
                                </div>
                            </div>
                            <div class="window-body" style={{ textAlign: 'center' }}>
                                <div style={{ border: '2px inset', backgroundColor: 'white', padding: '10px', display: 'inline-block' }}>
                                    <img src={`data:image/png;base64,${pixData.qrcode}`} width="200" height="200" alt="QR Code" />
                                </div>
                                <p style={{ fontSize: '10px', marginTop: '10px' }}>Copie o código abaixo se necessário:</p>
                                <button class="btn" style={{ fontSize: '10px', width: '100%' }} onClick={() => navigator.clipboard.writeText(pixData.payload)}>
                                    Copiar Payload PIX
                                </button>
                                <p style={{ fontSize: '10px', color: 'darkblue', marginTop: '10px' }}>Aguardando confirmação do sistema...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div class="taskbar">
                <div style={{marginLeft: 'auto', padding: '0 5px', border: '2px inset', backgroundColor: 'var(--win-gray)', fontSize: '11px', marginRight: '5px'}}>
                    Rifa do Ivan
                </div>
            </div>
        </div>
    );
}
