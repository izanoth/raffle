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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTimer(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
                sessionStorage.setItem('new-client', JSON.stringify(client));
                route('/checkout');
            } else {
                setErrors({ submit: client.error || 'Registration failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Connection error' });
        }
    };

    return (
        <div class="window" style={{ marginTop: '20px' }}>
            <div class="title-bar">
                <div class="title-bar-text">Rifa Estudantil - Sorteio Galaxy Book 2</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">_</button>
                    <button aria-label="Maximize">口</button>
                    <button aria-label="Close" onClick={() => window.close()}>×</button>
                </div>
            </div>

            <div class="window-body">
                <div class="fieldset">
                    <span class="fieldset-label">Status do Sistema</span>
                    <p style={{ margin: '0', fontSize: '11px' }}>Processamento ativo // Hora: {timer}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: 'blue' }}>Prêmio: Samsung Galaxy Book 2 (v1.0)</p>
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

                    <div class="mb-3">
                        <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>CPF/CNPJ:</label>
                        <input
                            class="form-control"
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onInput={handleChange}
                            placeholder={errors.cpf || ""}
                        />
                        {errors.cpf && <p style={{ color: 'red', fontSize: '10px', margin: '2px 0 0 0' }}>{errors.cpf}</p>}
                    </div>

                    <div class="fieldset">
                        <span class="fieldset-label">Configuração de Bilhetes</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button type="button" class="btn" onClick={() => handleUnitChange(-1)}>-</button>
                            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{formData.units}</span>
                            <button type="button" class="btn" onClick={() => handleUnitChange(1)}>+</button>
                            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>R$ {(formData.units * 1).toFixed(2)}</span>
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

            <div class="taskbar">
                <button class="btn start-btn">
                   <span style={{fontSize:'16px'}}>田</span> Iniciar
                </button>
                <div style={{marginLeft: 'auto', padding: '0 5px', border: '2px inset', backgroundColor: 'var(--win-gray)', fontSize: '11px', marginRight: '5px'}}>
                    Rifa Estudantil v1.0
                </div>
                <div style={{border: '2px inset', backgroundColor: 'var(--win-gray)', padding: '0 5px', fontSize: '11px'}}>
                    {timer}
                </div>
            </div>

            {modal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 128, 128, 0.7)', zIndex: 2000,
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
                        <div class="window-body" style={{ overflowY: 'auto', flex: 1, backgroundColor: modal === 'intro' ? 'var(--win-gray)' : '#fff' }}>
                            {modal === 'intro' ? (
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ marginBottom: '20px', border: '2px inset', padding: '15px', backgroundColor: '#fff', textAlign: 'left', lineHeight: '1.6' }}>
                                        <p><strong>Olá!</strong></p>
                                        <p>Meu nome é <strong>Ivan</strong> e sou estudante do curso Técnico em Farmácia na <strong>Etec de Itanhaém</strong>.</p>
                                        <p>Estou realizando esta rifa com um objetivo simples e honesto: preciso comprar uma bicicleta para meu deslocamento e consertar o meu celular, que é minha ferramenta de estudos.</p>
                                        <p>Sua participação, além de lhe dar a chance de ganhar um excelente prêmio, me ajuda muito a alcançar esse objetivo.</p>
                                        <p>Boa sorte!</p>
                                    </div>
                                    <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>ENTRAR</button>
                                </div>
                            ) : (
                                <iframe 
                                    src={modal === 'contract' ? '/includes/contract.html' : '/includes/rules.html'} 
                                    style={{ width: '100%', height: '400px', border: 'none' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
