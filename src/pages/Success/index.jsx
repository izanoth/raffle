import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function Success() {
    const { route } = useLocation();
    const [client, setClient] = useState(null);
    const [bilhetes, setBilhetes] = useState([]);
    const [payInPerson, setPayInPerson] = useState(false);
    const [modal, setModal] = useState(null);
    const [playfulContent, setPlayfulContent] = useState({ title: '', message: '' });

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

    const handleSystemControl = (type) => {
        const contents = {
            close: {
                title: 'Impressão Pendente',
                message: 'Parar agora? Você ainda nem salvou seu bilhete! O sistema recomenda imprimir ou salvar em PDF antes de sair, para garantir sua tranquilidade física e mental.'
            },
            minimize: {
                title: 'Sorte em Primeiro Plano',
                message: 'O sistema detectou que você está tentando esconder sua vitória. Mantenha os bilhetes visíveis para maximizar o Karma Digital.'
            },
            maximize: {
                title: 'Configurações de Exibição',
                message: 'Os bilhetes já estão renderizados com a máxima tecnologia XP de suavização. Maximizar agora causaria uma sobrecarga de nostalgia.'
            }
        };
        setPlayfulContent(contents[type]);
        setModal('playful');
    };

    if (!client) return <div class="window"><div class="window-body">Dados do sistema indisponíveis.</div></div>;

    const handlePrint = () => {
        const originalTitle = document.title;
        const date = new Date();
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        const dateStr = `${d}${m}${y}`;
        const orderId = (client.id || '001').toString().padStart(3, '0');
        
        document.title = `rifa-do-ivan_pedido-no${orderId}_${dateStr}`;
        window.print();
        document.title = originalTitle;
    };

    const todayDate = new Date().toLocaleDateString('pt-BR');

    return (
        <div class="window success">
            <div class="title-bar no-print">
                <div class="title-bar-text">Sucesso - Rifa do Ivan</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onClick={() => handleSystemControl('minimize')}>_</button>
                    <button aria-label="Maximize" onClick={() => handleSystemControl('maximize')}>口</button>
                    <button aria-label="Close" onClick={() => handleSystemControl('close')}>×</button>
                </div>
            </div>

            <div class="window-body">
                {payInPerson && (
                    <div class="fieldset" style={{ border: '1px solid #cc3000', marginBottom: '10px' }}>
                        <p style={{ margin: '0', fontSize: '11px', color: '#cc3000', fontWeight: 'bold' }}>
                            Nota: Como você optou por pagar pessoalmente, lembre-se de que os bilhetes porderão ser cancelados. Agradeço a sua compreensão!
                        </p>
                    </div>
                )}

                <div class="inner tokbg">
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

                <div style={{ marginTop: '20px', textAlign: 'center' }} class="no-print">
                    <small style={{ fontSize: '11px', color: 'black' }}>Dúvidas só entrar em contato </small>
                    <button class="btn" style={{ width: '100%', marginTop: '10px' }} onClick={handlePrint}>Imprimir / PDF</button>
                    <button class="btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => {
                        if (typeof window !== 'undefined') sessionStorage.removeItem('payInPerson');
                        route('/');
                    }}>Concluir</button>
                </div>
            </div>

            <div class="taskbar no-print">
                <div style={{marginLeft: 'auto', padding: '0 5px', border: '2px inset', backgroundColor: 'var(--win-gray)', fontSize: '11px', marginRight: '5px'}}>
                    Rifa do Ivan
                </div>
            </div>

            {modal === 'playful' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }} class="no-print">
                    <div class="window" style={{ maxWidth: '400px', width: '100%' }}>
                        <div class="title-bar">
                            <div class="title-bar-text">{playfulContent.title}</div>
                            <div class="title-bar-controls">
                                <button aria-label="Close" onClick={() => setModal(null)}>×</button>
                            </div>
                        </div>
                        <div class="window-body">
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ 
                                    width: '48px', height: '48px', background: '#e81123', borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', 
                                    fontSize: '32px', fontWeight: 'bold', flexShrink: 0 
                                }}>!</div>
                                <p style={{ textAlign: 'left', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
                                    {playfulContent.message}
                                </p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
