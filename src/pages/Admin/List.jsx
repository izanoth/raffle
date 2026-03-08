import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function List() {
    const { route } = useLocation();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/admin/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleConfirmPayment = async (id) => {
        if (!confirm('Deseja confirmar o pagamento manual deste cliente?')) return;
        
        try {
            const response = await fetch(`/api/admin/clients/${id}/confirm-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                fetchClients();
            } else {
                alert('Erro ao confirmar pagamento.');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('admin');
        }
        route('/admin');
    };

    return (
        <div class="window" style={{ marginTop: '20px', width: '98%', maxWidth: '1000px' }}>
            <div class="title-bar">
                <div class="title-bar-text">Administração - Lista de Clientes</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">_</button>
                    <button aria-label="Maximize">口</button>
                    <button aria-label="Close" onClick={() => route('/admin/panel')}>×</button>
                </div>
            </div>

            <div class="window-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <button class="btn" onClick={() => route('/admin/panel')}>← Voltar ao Painel</button>
                    <button class="btn" onClick={handleLogout} style={{ color: '#cc3000' }}>Logout</button>
                </div>

                <div class="fieldset">
                    <span class="fieldset-label">Participantes Registrados</span>
                    <div style={{ overflowX: 'auto', backgroundColor: '#fff', border: '1px inset', padding: '1px' }}>
                        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#ece9d8', borderBottom: '1px solid #707070', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th style={{ padding: '8px' }}>ID</th>
                                    <th style={{ padding: '8px' }}>Data</th>
                                    <th style={{ padding: '8px' }}>Nome</th>
                                    <th style={{ padding: '8px' }}>Email/Telefone</th>
                                    <th style={{ padding: '8px' }}>CPF</th>
                                    <th style={{ padding: '8px' }}>Método</th>
                                    <th style={{ padding: '8px' }}>Valor</th>
                                    <th style={{ padding: '8px' }}>Status</th>
                                    <th style={{ padding: '8px', textAlign: 'center' }}>Confirmar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '8px' }}>{client.id}</td>
                                        <td style={{ padding: '8px' }}>{new Date(client.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{client.name}</td>
                                        <td style={{ padding: '8px' }}>
                                            <div style={{ fontSize: '10px' }}>{client.email}</div>
                                            <div style={{ fontSize: '10px', color: '#666' }}>{client.phone}</div>
                                        </td>
                                        <td style={{ padding: '8px' }}>{client.cpf}</td>
                                        <td style={{ padding: '8px' }}>{client.asaas_id ? 'PIX' : 'In Person'}</td>
                                        <td style={{ padding: '8px' }}>R$ {client.amount.toFixed(2)}</td>
                                        <td style={{ padding: '8px', fontWeight: 'bold', color: client.paid ? 'green' : '#ff8e00' }}>
                                            {client.paid ? 'PAGO' : 'PENDENTE'}
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            {!client.paid && (
                                                <input 
                                                    type="checkbox" 
                                                    onChange={() => handleConfirmPayment(client.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="taskbar" style={{ position: 'relative', marginTop: '10px', bottom: '0' }}>
                <div style={{ marginLeft: 'auto', padding: '0 5px', fontSize: '11px' }}>
                    Total de Participantes: {clients.length}
                </div>
            </div>
        </div>
    );
}
