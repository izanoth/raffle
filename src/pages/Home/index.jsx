import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { validateCpf } from '../../helpers/utils';
import '@styles';

export function Home() {
    const { route } = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        units: 1,
        terms: false
    });
    const [timer, setTimer] = useState('00:00:00');
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState('intro'); // 'intro', 'contract', 'rules', null
    const [activeWindow, setActiveWindow] = useState('form'); // 'form', 'status'
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [raffleStatus, setRaffleStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTimer(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

    const toggleStartMenu = () => setShowStartMenu(!showStartMenu);

    const openParticipar = () => {
        setActiveWindow('form');
        setShowStartMenu(false);
    };

    const openStatus = () => {
        setActiveWindow('status');
        setShowStartMenu(false);
        fetchStatus();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
        if (!formData.name) newErrors.name = 'Error: Missing name';
        if (!formData.email) newErrors.email = 'Error: Missing email';
        if (!formData.phone) newErrors.phone = 'Error: Missing phone';
        if (!validateCpf(formData.cpf)) newErrors.cpf = 'Error: Invalid CPF';
        if (!formData.terms) newErrors.terms = 'Error: Agreement required';

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
                setErrors({ submit: client.error || 'Registration failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Connection error' });
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>          
            {/* Form Window */}
            {activeWindow === 'form' && (
                <div class="window" style={{ marginTop: '20px' }}>
                    <div class="title-bar">
                        <div class="title-bar-text">Rifa do Ivan - Participar</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={() => setActiveWindow(null)}>_</button>
                            <button aria-label="Maximize">口</button>
                            <button aria-label="Close" onClick={() => setActiveWindow(null)}>×</button>
                        </div>
                    </div>

                    <div class="window-body">
                        <div class="fieldset">
                            <span class="fieldset-label">Status do Sistema</span>
                            <p style={{ margin: '0', fontSize: '11px' }}>Processamento ativo // Hora: {timer}</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: 'blue' }}>Prêmio: Alexa Echo Dot 5ª Geração</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>
                                <a href="#" onClick={openRules} style={{ color: 'blue', textDecoration: 'underline' }}>Leia as regras do sorteio</a>
                            </p>
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
                                    placeholder={errors.name || ""}
                                />
                            </div>

                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>E-mail:</label>
                                <input
                                    class="form-control"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onInput={handleChange}
                                    placeholder={errors.email || ""}
                                />
                            </div>

                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>WhatsApp/Celular:</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onInput={handleChange}
                                    placeholder={errors.phone || ""}
                                />
                            </div>

                            <div class={errors.cpf ? "mb-3-with-error" : "mb-3"}>
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>CPF/CNPJ:</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onInput={handleChange}
                                    placeholder={errors.cpf || ""}
                                />
                                {errors.cpf && <p style={{ color: 'red', fontSize: '10px', margin: '2px 0 0 0', position: 'absolute' }}>{errors.cpf}</p>}
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

                            {errors.submit && <p style={{ color: 'red', fontSize: '10px' }}>{errors.submit}</p>}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                <button class="btn" type="submit" disabled={!formData.terms}>OK</button>
                                <button class="btn" type="button" onClick={() => route('/')}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Window */}
            {activeWindow === 'status' && (
                <div class="window" style={{ marginTop: '20px' }}>
                    <div class="title-bar">
                        <div class="title-bar-text">Status da Rifa do Ivan</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={() => setActiveWindow(null)}>_</button>
                            <button aria-label="Maximize">口</button>
                            <button aria-label="Close" onClick={() => setActiveWindow(null)}>×</button>
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
                                                backgroundColor: '#388e3c', 
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
                                            <thead style={{ position: 'sticky', top: 0, background: '#ece9d8', borderBottom: '1px solid #707070' }}>
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
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button class="btn" onClick={fetchStatus} style={{ minWidth: '100px' }}>Atualizar</button>
                                </div>
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '20px' }}>Erro ao carregar dados.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Start Menu */}
            {showStartMenu && (
                <div class="start-menu">
                    <div class="start-menu-header">
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#245edb' }}>
                            XP
                        </div>
                        <span>Rifa do Ivan</span>
                    </div>
                    <div class="start-menu-item" onClick={openParticipar}>
                        <span style={{ fontSize: '20px' }}>📝</span>
                        <span>Participar da Rifa</span>
                    </div>
                    <div class="start-menu-item" onClick={openStatus}>
                        <span style={{ fontSize: '20px' }}>📊</span>
                        <span>Ver Status da Rifa</span>
                    </div>
                    <div style={{ borderTop: '1px solid #f0f0f0', margin: '5px 0' }} />
                    <div class="start-menu-item" onClick={() => { setShowStartMenu(false); setActiveWindow(null); }}>
                        <span style={{ fontSize: '20px' }}>🚪</span>
                        <span>Sair</span>
                    </div>
                </div>
            )}

            {/* Taskbar */}
            <div class="taskbar">
                <button class="start-btn-xp" onClick={toggleStartMenu}>
                   <span style={{ fontSize: '18px' }}>田</span> start
                </button>

                <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                    {activeWindow === 'form' && (
                        <div style={{ padding: '2px 10px', backgroundColor: '#316ac5', color: 'white', fontSize: '11px', border: '1px solid #003b9b', borderRadius: '3px' }}>
                            Participar...
                        </div>
                    )}
                    {activeWindow === 'status' && (
                        <div style={{ padding: '2px 10px', backgroundColor: '#316ac5', color: 'white', fontSize: '11px', border: '1px solid #003b9b', borderRadius: '3px' }}>
                            Status da Rifa
                        </div>
                    )}
                </div>

                <div style={{ marginLeft: 'auto', padding: '0 5px', border: '2px inset', backgroundColor: 'var(--win-gray)', fontSize: '11px', marginRight: '5px' }}>
                    Rifa do Ivan
                </div>
                <div style={{ border: '2px inset', backgroundColor: 'var(--win-gray)', padding: '0 5px', fontSize: '11px' }}>
                    {timer}
                </div>
            </div>

            {/* Modals */}
            {modal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div class="window" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div class="title-bar">
                            <div class="title-bar-text">
                                {modal === 'intro' ? 'Mensagem do Sistema' : 
                                 modal === 'contract' ? 'Contrato de Participação' : 'Regras do Sorteio'}
                            </div>
                            <div class="title-bar-controls">
                                <button aria-label="Close" onClick={() => setModal(null)}>×</button>
                            </div>
                        </div>
                        <div class="window-body" style={{ overflowY: 'auto', flex: 1, backgroundColor: 'var(--win-gray)' }}>
                            {modal === 'intro' ? (
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ marginBottom: '20px', border: '2px inset', padding: '15px', backgroundColor: '#fff', textAlign: 'left', lineHeight: '1.6' }}>
                                        <p><strong>Olá!</strong></p>
                                        <p>Meu nome é <strong>Ivan</strong> e sou estudante do curso Técnico em Farmácia na <strong>Etec de Itanhaém</strong>.</p>
                                        <p>Quero comprar uma bicicleta e, quem sabe, trocar de celular. Por isso, decidi fazer essa rifa.</p>
                                        <p>Boa sorte!</p>
                                    </div>
                                    <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
                                </div>
                            ) : (
                                <div style={{ padding: '10px' }}>
                                    <div style={{ 
                                        backgroundColor: '#fff', 
                                        border: '2px inset', 
                                        padding: '15px', 
                                        fontSize: '12px', 
                                        lineHeight: '1.4',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}>
                                        <h2 style={{ fontSize: '14px', textDecoration: 'underline', marginTop: 0, textAlign: 'center' }}>
                                            {modal === 'contract' ? 'TERMOS DO CONTRATO DIGITAL' : 'REGRAS DO SORTEIO'}
                                        </h2>
                                        
                                        {modal === 'contract' ? (
                                            <>
                                                <p><strong>1. O que é este contrato?</strong></p>
                                                <p>Este documento explica como funciona sua participação na minha rifa. Ao aceitar, você concorda com os pontos abaixo.</p>

                                                <p><strong>2. Como participar</strong></p>
                                                <p>Você escolhe a quantidade de números (bilhetes) e faz o pagamento via PIX. Cada número te dá uma chance de ganhar o prêmio anunciado.</p>

                                                <p><strong>3. E se a rifa for cancelada?</strong></p>
                                                <p>Se por algum motivo a rifa não puder acontecer (como não atingir o mínimo de vendas), eu, Ivan, devolverei 100% do seu dinheiro automaticamente pelo mesmo PIX que você usou.</p>

                                                <p><strong>4. Seus dados estão seguros</strong></p>
                                                <p>As informações que você preenche (nome, e-mail, telefone) servem apenas para te identificar no sorteio e para que eu possa te entregar o prêmio.</p>

                                                <p><strong>5. Ética e Respeito</strong></p>
                                                <p>Participar da rifa deve ser algo feito de boa fé, respeitando os outros estudantes e o organizador.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>1. Regras gerais do sorteio</strong></p>
                                                <p>1.1 Para concorrer ao sorteio o sr(a). deverá fazer a adesão de pelo menos um bilhete.</p>
                                                <p>1.2 Cada bilhete tem o preço de R$ 5,00 e lhe conferirá o direito de concorrer ao sorteio.</p>
                                                <p>1.3 Você pode comprar quantos bilhetes quiser, aumentando suas chances de ganhar.</p>
                                                <p>1.4 O sorteio não possui data fixa. O sorteio será realizado assim que a meta mínima de 500 (quinhentos) bilhetes vendidos for alcançada.</p>

                                                <p><strong>2. Do pagamento</strong></p>
                                                <p>2.1 O pagamento deverá ser feito via PIX após o envio do formulário.</p>

                                                <p><strong>3. Da efetivação</strong></p>
                                                <p>3.1 Uma vez o pagamento efetuado, o sr(a). receberá o comprovante da sua participação, contendo os números com os quais concorrerá.</p>

                                                <p><strong>4. Do prêmio</strong></p>
                                                <p>4.1 O vencedor será contactado por meio do número de telefone para confirmar o método de recebimento.</p>
                                                <p>4.2 Caso se faça necessário, o prêmio poderá ser enviado por Sedex, sem custos para o vencedor.</p>
                                            </>
                                        )}
                                        
                                        <div style={{ marginTop: '20px', fontSize: '10px', textAlign: 'center', color: '#808080' }}>
                                            Rifa do Ivan - Sistema de Ajuda v1.1
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                                        <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
