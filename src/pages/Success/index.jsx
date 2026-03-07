import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function Success() {
    const { route } = useLocation();
    const [client, setClient] = useState(null);
    const [bilhetes, setBilhetes] = useState([]);
    const [payInPerson, setPayInPerson] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedClient = sessionStorage.getItem('new-client');
            const inPerson = sessionStorage.getItem('payInPerson') === 'true';
            setPayInPerson(inPerson);
            
            if (!storedClient) {
                route('/');
                return;
            }
            const clientData = JSON.parse(storedClient);
            setClient(clientData);
            
            if (clientData.tickets) {
               try {
                   setBilhetes(JSON.parse(clientData.tickets));
               } catch(e) {
                   setBilhetes([]);
               }
            }
        }
    }, []);

    if (!client) return <div class="window"><div class="window-body">Dados do sistema indisponíveis.</div></div>;

    const todayDate = new Date().toLocaleDateString('pt-BR');

    return (
        <div class="window success">
            <div class="title-bar">
                <div class="title-bar-text">Sucesso - Rifa do Ivan</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">_</button>
                    <button aria-label="Maximize">口</button>
                    <button aria-label="Close" onClick={() => route('/')}>×</button>
                </div>
            </div>

            <div class="window-body">
                <div class="fieldset">
                    <span class="fieldset-label">Confirmação de Transação</span>
                    <p style={{ margin: '0', fontSize: '11px' }}>Tire um print como comprovante. Obrigado!</p>
                    {payInPerson && (
                        <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#cc3000', fontWeight: 'bold' }}>
                            Nota: Como você optou por pagar pessoalmente, lembre-se de que os bilhetes porderão ser cancelados. Agradeço a sua compreensão!
                        </p>
                    )}
                </div>

                <div class="inner tokbg" style={{ paddingBottom: '10px', textAlign: 'center', marginBottom: '10px', borderRadius: '30px', color: 'white' }}>
                    <table style={{ color: '#000', fontWeight: '900', width: '100%', position: 'relative', textAlign: 'center' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '12px' }}>Nome: {client.name} </td>
                                <td style={{ fontSize: '12px' }}>Data: {todayDate}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style={{ padding: '10px', fontSize: '12px' }}>Sorteio: 000000001</td>
                            </tr>
                            {bilhetes.map((item) => (
                                <tr key={item}>
                                    <td colspan="2" style={{ textAlign: 'center', fontSize: '32px', textShadow: '1px 1px 2px dark' }}>
                                        <p class="mask">{item}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <small style={{ fontSize: '11px', color: 'black' }}>Dúvidas só entrar em contato </small>
                    <button class="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => {
                        if (typeof window !== 'undefined') sessionStorage.removeItem('payInPerson');
                        route('/');
                    }}>Concluir</button>
                </div>
            </div>

            <div class="taskbar">
                <div style={{marginLeft: 'auto', padding: '0 5px', border: '2px inset', backgroundColor: 'var(--win-gray)', fontSize: '11px', marginRight: '5px'}}>
                    Rifa do Ivan
                </div>
            </div>
        </div>
    );
}
