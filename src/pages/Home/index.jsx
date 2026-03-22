import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { maskPhone } from '../../helpers/utils';
import { Intro } from './components/Intro';
import { Contract } from './components/Contract';
import { Rules } from './components/Rules';
import { Playful } from './components/Playful';
import '@styles';

function SystemTimer() {
    const [timer, setTimer] = useState('00:00:00');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTimer(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span>{timer}</span>;
}

export function Home() {
    const { route } = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        units: 1,
        terms: false
    });
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState('intro'); // 'intro', 'contract', 'rules', 'playful', null
    const [activeWindow, setActiveWindow] = useState('form'); // 'form', 'status'
    const [playfulContent, setPlayfulContent] = useState({ title: '', message: '' });
    const [raffleStatus, setRaffleStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const fetchStatus = async () => {
        setLoadingStatus(true);
        try {
            const response = await fetch('/api/raffle/status');
            const data = await response.json();
            setRaffleStatus(data);
        } catch (error) {
            console.error('Error fetching status:', error);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleSystemControl = (type) => {
        const contents = {
            close: {
                title: 'Acesso Negado',
                message: 'ERRO 403: O botão de fechar foi desativado por questões de segurança. O sistema detectou que você ainda não garantiu sua chance de ganhar! Tentar sair agora pode causar "falta de sorte" crônica.'
            },
            minimize: {
                title: 'Gerenciador de Janelas',
                message: 'Atenção: Minimizar a sorte não é recomendado. Mantenha a janela aberta para que as vibrações positivas do servidor alcancem seu dispositivo.'
            },
            maximize: {
                title: 'Ajuste de Resolução',
                message: 'Otimizando para 8K... Brincadeira! Este sistema foi projetado para a resolução perfeita de 2001. Você já está vendo o ápice da tecnologia atual.'
            }
        };
        setPlayfulContent(contents[type]);
        setModal('playful');
    };

    const openParticipar = () => {
        setActiveWindow('form');
    };

    const openStatus = () => {
        setActiveWindow('status');
        fetchStatus();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'phone') {
            newValue = maskPhone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleUnitChange = (delta) => {
        setFormData(prev => ({
            ...prev,
            units: Math.max(1, prev.units + delta)
        }));
    };

    const openContract = (e) => {
        e.preventDefault();
        setModal('contract');
    };

    const openRules = (e) => {
        e.preventDefault();
        setModal('rules');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Erro: Nome obrigatório';
        if (!formData.email) newErrors.email = 'Erro: E-mail obrigatório';
        if (!formData.phone) newErrors.phone = 'Erro: WhatsApp obrigatório';
        if (!formData.terms) newErrors.terms = 'Erro: Aceite obrigatório';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const client = await response.json();

            if (response.ok) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('new-client', JSON.stringify(client));
                }
                route('/checkout');
            } else {
                setErrors({ submit: client.error || 'Falha no registro' });
            }
        } catch (error) {
            setErrors({ submit: 'Erro de conexão' });
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>          
            {/* Form Window */}
            {activeWindow === 'form' && (
                <div class="window">
                    <div class="title-bar">
                        <div class="title-bar-text">Rifa do Ivan - Participar</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={() => handleSystemControl('minimize')}>_</button>
                            <button aria-label="Maximize" onClick={() => handleSystemControl('maximize')}>口</button>
                            <button aria-label="Close" onClick={() => handleSystemControl('close')}>×</button>
                        </div>
                    </div>

                    <div class="window-body">
                        <div class="header-layout">
                            {/* Logo integrado - Height dynamically stretches to match fieldset */}
                            <div class="logo-box">
                                <img src="/img/rifadoivan.png" alt="Rifa do Ivan" />
                            </div>

                            <div class="header-info">
                                <div class="fieldset" style={{ marginBottom: 0 }}>
                                    <span class="fieldset-label">Status do Sistema</span>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                                        <div>
                                            <p style={{ margin: '0', fontSize: '11px' }}>Processamento ativo // <SystemTimer /></p>
                                            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: 'blue' }}>Prêmio: 50% do Arrecadado</p>
                                            <p style={{ margin: '3px 0 0 0', fontSize: '11px' }}>
                                                <a href="#" onClick={openRules} style={{ color: 'blue', textDecoration: 'underline' }}>Regras do sorteio</a>
                                            </p>
                                        </div>
                                        <button type="button" class="btn" onClick={openStatus} style={{ fontWeight: 'bold', fontSize: '10px', padding: '5px' }}>Ver Status</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Nome:</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onInput={handleChange}
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && <p class="error-text">{errors.name}</p>}
                            </div>

                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>E-mail:</label>
                                <input
                                    class="form-control"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onInput={handleChange}
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && <p class="error-text">{errors.email}</p>}
                            </div>

                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>WhatsApp/Celular:</label>
                                <input
                                    class="form-control"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onInput={handleChange}
                                    placeholder="(00) 00000-0000"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    required
                                />
                                {errors.phone && <p class="error-text">{errors.phone}</p>}
                            </div>

                            <div class="fieldset">
                                <span class="fieldset-label">Configuração de Bilhetes</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button type="button" class="btn" onClick={() => handleUnitChange(-1)}>-</button>
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{formData.units}</span>
                                    <button type="button" class="btn" onClick={() => handleUnitChange(1)}>+</button>
                                    <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>R$ {(formData.units * 5).toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                                <input
                                    type="checkbox"
                                    name="terms"
                                    id="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                />
                                <label for="terms" style={{ fontSize: '11px', marginLeft: '5px' }}>
                                    Aceito os <a href="#" onClick={openContract} style={{ color: 'blue', textDecoration: 'underline' }}>termos do contrato digital</a>.
                                </label>
                            </div>

                            {errors.submit && <p class="error-text" style={{ fontSize: '12px', marginBottom: '10px' }}>{errors.submit}</p>}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                <button class="btn" type="submit" disabled={!formData.terms}>OK</button>
                                <button class="btn" type="button" onClick={() => handleSystemControl('close')}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Window */}
            {activeWindow === 'status' && (
                <div class="window">
                    <div class="title-bar">
                        <div class="title-bar-text">Status da Rifa do Ivan</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={() => handleSystemControl('minimize')}>_</button>
                            <button aria-label="Maximize" onClick={() => handleSystemControl('maximize')}>口</button>
                            <button aria-label="Close" onClick={() => setActiveWindow('form')}>×</button>
                        </div>
                    </div>
                    <div class="window-body">
                        {loadingStatus ? (
                            <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados...</p>
                        ) : raffleStatus ? (
                            <div>
                                <div class="fieldset">
                                    <span class="fieldset-label">Progresso Geral</span>
                                    <div style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                                            <span>Objetivo: {raffleStatus.goal} bilhetes</span>
                                            <span>{raffleStatus.totalSold} vendidos</span>
                                        </div>
                                        <div style={{ height: '15px', backgroundColor: '#fff', border: '1px solid #707070', padding: '1px' }}>
                                            <div style={{ 
                                                height: '100%', 
                                                backgroundColor: '#0055e5', 
                                                width: `${Math.min(100, (raffleStatus.totalSold / raffleStatus.goal) * 100)}%`,
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                <div class="fieldset">
                                    <span class="fieldset-label">Últimos Participantes</span>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', border: '1px inset' }}>
                                        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                                            <thead style={{ position: 'sticky', top: 0, background: 'var(--win-gray)', borderBottom: '1px solid #707070' }}>
                                                <tr>
                                                    <th style={{ textAlign: 'left', padding: '5px' }}>Email</th>
                                                    <th style={{ textAlign: 'left', padding: '5px' }}>Tel</th>
                                                    <th style={{ textAlign: 'right', padding: '5px' }}>Bilhetes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {raffleStatus.participants.map((p, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                                        <td style={{ padding: '5px' }}>{p.email}</td>
                                                        <td style={{ padding: '5px' }}>{p.phone}</td>
                                                        <td style={{ padding: '5px', textAlign: 'right' }}>{p.units}</td>
                                                    </tr>
                                                ))}
                                                {raffleStatus.participants.length === 0 && (
                                                    <tr>
                                                        <td colspan="3" style={{ textAlign: 'center', padding: '10px' }}>Nenhum participante ainda. Seja o primeiro!</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                                    <button class="btn" onClick={fetchStatus} style={{ minWidth: '100px' }}>Atualizar</button>
                                    <button class="btn" onClick={openParticipar} style={{ minWidth: '100px' }}>Voltar</button>
                                </div>
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '20px' }}>Erro ao carregar dados.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {modal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div class="window" style={{ maxWidth: (modal === 'playful' || modal === 'intro') ? '320px' : '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div class="title-bar">
                            <div class="title-bar-text">
                                {modal === 'intro' ? 'Mensagem do Sistema' : 
                                 modal === 'contract' ? 'Contrato de Participação' : 
                                 modal === 'rules' ? 'Regras do Sorteio' : playfulContent.title}
                            </div>
                            <div class="title-bar-controls">
                                <button aria-label="Close" onClick={() => setModal(null)}>×</button>
                            </div>
                        </div>
                        <div class="window-body" style={{ overflowY: 'auto', flex: 1 }}>
                            {modal === 'playful' ? (
                                <Playful content={playfulContent} onClose={() => setModal(null)} />
                            ) : modal === 'intro' ? (
                                <Intro onClose={() => setModal(null)} />
                            ) : modal === 'contract' ? (
                                <Contract onClose={() => setModal(null)} />
                            ) : modal === 'rules' ? (
                                <Rules onClose={() => setModal(null)} />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
