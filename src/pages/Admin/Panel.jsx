import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function Panel() {
    const { route } = useLocation();
    const [stats, setStats] = useState({
        registers: 0,
        payments: 0,
        asaasIntents: 0,
        totalIntents: 0
    });
    const [winner, setWinner] = useState(null);
    const [loadingDraw, setLoadingDraw] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayNumber, setDisplayNumber] = useState('????');

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDraw = async () => {
        if (!confirm('Deseja realizar o sorteio agora?')) return;
        setLoadingDraw(true);
        setWinner(null);
        try {
            const response = await fetch('/api/admin/draw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                // Start "Peão" animation
                setIsSpinning(true);
                let count = 0;
                const interval = setInterval(() => {
                    setDisplayNumber(Math.floor(1000 + Math.random() * 9000).toString());
                    count += 50;
                    if (count >= 4000) { // 4 seconds of suspense
                        clearInterval(interval);
                        setIsSpinning(false);
                        setWinner(data.winner);
                        setDisplayNumber(data.winner.ticket);
                    }
                }, 50);
            } else {
                alert(data.error || 'Erro ao realizar sorteio.');
                setLoadingDraw(false);
            }
        } catch (error) {
            console.error('Error during draw:', error);
            alert('Erro de conexão ao servidor.');
            setLoadingDraw(false);
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('admin');
        }
        route('/admin');
    };

    return (
        <div class="window" style={{ marginTop: '20px', maxWidth: '600px', width: '100%' }}>
            <div class="title-bar">
                <div class="title-bar-text">Administração - Painel de Controle</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">_</button>
                    <button aria-label="Maximize">口</button>
                    <button aria-label="Close" onClick={handleLogout}>×</button>
                </div>
            </div>

            <div class="window-body">
                <div class="fieldset">
                    <span class="fieldset-label">Status Geral do Sistema</span>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px inset' }}>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '8px' }}>Total de Registros:</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{stats.registers}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '8px' }}>Pagamentos Confirmados:</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'green' }}>{stats.payments}</td>
                            </tr>
                            <tr style={{ backgroundColor: '#f9f9f9' }}>
                                <td style={{ padding: '8px' }} colspan="2"><b>Intenções PIX (Asaas):</b></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '8px', paddingLeft: '20px' }}>Pendentes no Asaas:</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{stats.asaasIntents}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>Total Geral de Intenções:</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'blue' }}>{stats.totalIntents}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Sorteio Suspension/Winner Display */}
                {(isSpinning || winner) && (
                    <div class="fieldset" style={{ 
                        border: '3px solid #ff8e00', 
                        backgroundColor: '#fff', 
                        textAlign: 'center',
                        padding: '20px',
                        boxShadow: 'inset 0 0 15px rgba(255,142,0,0.2)'
                    }}>
                        <span class="fieldset-label" style={{ color: '#ff8e00' }}>
                            {isSpinning ? '⚠️ SORTEANDO... ⚠️' : '🎉 RESULTADO FINAL 🎉'}
                        </span>
                        
                        <div style={{ margin: '15px 0' }}>
                            <div style={{ 
                                fontSize: '64px', 
                                fontWeight: '900', 
                                color: isSpinning ? '#777' : '#cc3000',
                                fontFamily: "'Courier New', Courier, monospace",
                                letterSpacing: '8px',
                                textShadow: isSpinning ? 'none' : '2px 2px 0px #000',
                                display: 'inline-block',
                                padding: '10px 20px',
                                border: '4px double #777',
                                backgroundColor: isSpinning ? '#f0f0f0' : '#ffff99'
                            }}>
                                {displayNumber}
                            </div>
                        </div>

                        {winner && !isSpinning && (
                            <div style={{ 
                                animation: 'winnerReveal 0.5s ease-out forwards',
                                opacity: 0,
                                transform: 'translateY(10px)'
                            }}>
                                <p style={{ fontSize: '18px', margin: '5px 0', fontWeight: 'bold' }}>GANHADOR(A): {winner.name}</p>
                                <p style={{ fontSize: '13px', color: '#666', margin: '2px 0' }}>ID: {winner.clientId.toString().padStart(6, '0')}</p>
                                <p style={{ fontSize: '12px', color: '#444', fontStyle: 'italic' }}>Contato: {winner.phone}</p>
                            </div>
                        )}
                        
                        <style>{`
                            @keyframes winnerReveal {
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>
                    </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <button class="btn" onClick={() => route('/admin/list')} style={{ minWidth: '120px' }}>Lista de Clientes</button>
                    <button class="btn" onClick={() => route('/admin/hasher')} style={{ minWidth: '120px' }}>Gerador de Hash</button>
                    <button 
                        class="btn" 
                        onClick={handleDraw} 
                        disabled={loadingDraw}
                        style={{ minWidth: '150px', fontWeight: 'bold', backgroundColor: '#ff8e00', border: '1px solid #cc3000' }}
                    >
                        {loadingDraw ? 'Sorteando...' : 'REALIZAR SORTEIO'}
                    </button>
                    <button class="btn" onClick={handleLogout} style={{ minWidth: '120px', color: '#cc3000' }}>Encerrar Sessão</button>
                </div>
            </div>
            
            <div class="taskbar" style={{ position: 'relative', marginTop: '10px', bottom: '0' }}>
                <div style={{ marginLeft: 'auto', padding: '0 5px', fontSize: '11px' }}>
                    Admin Mode v1.2
                </div>
            </div>
        </div>
    );
}
