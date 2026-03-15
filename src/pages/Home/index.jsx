import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { maskPhone, maskCpf, validateCpf } from '../../helpers/utils';
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
        cpf: '',
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

        if (name === 'cpf') {
            newValue = maskCpf(value);
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
        if (formData.cpf && !validateCpf(formData.cpf)) {
            newErrors.cpf = 'Erro: CPF inválido';
        }
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

                            <div class="mb-3">
                                <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>CPF (Opcional):</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onInput={handleChange}
                                    placeholder="000.000.000-00"
                                    inputMode="numeric"
                                />
                                {errors.cpf && <p class="error-text">{errors.cpf}</p>}
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
                    <div class="window" style={{ maxWidth: modal === 'playful' ? '400px' : '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
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
                                <div style={{ padding: '10px', textAlign: 'center' }}>
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
                                    <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
                                </div>
                            ) : modal === 'intro' ? (
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <div style={{ marginBottom: '20px', border: '1px solid #919b9c', padding: '15px', backgroundColor: '#fff', textAlign: 'left', lineHeight: '1.6', borderRadius: '5px' }}>
                                        <p><strong>Olá!</strong></p>
                                        
                                        <p>Meu nome é <strong>Ivan</strong>. Sou estudante de Farmácia na Etec e, atualmente, faço meus deslocamentos a pé. 											Para facilitar minha locomoção diária — principalmente para estudar — estou realizando esta 												rifa com o objetivo de arrecadar o valor necessário para comprar uma bicicleta.</p>

										<p>Pensei na rifa como uma forma simples e justa de lidar com esse problema pontual, já que todos 											que participam também têm a chance de ganhar. O prêmio do sorteio será de 50% do valor total 												arrecadado.</p>

										<p>A contagem regressiva para o sorteio começará após a venda de um número mínimo de 100 bilhetes. 											A partir desse momento, será iniciada uma contagem de 30 dias até a realização do sorteio.</p>

										<p>Se puder participar, você estará contribuindo diretamente para que eu consiga continuar meus 											estudos com mais mobilidade. Obrigado pelo apoio e boa sorte! 🚲</p>									
                                    </div>
                                    <button class="btn" onClick={() => setModal(null)} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
                                </div>
                            ) : (
                                <div style={{ padding: '10px' }}>
                                    <div style={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #919b9c',
                                        padding: '15px', 
                                        fontSize: '12px', 
                                        lineHeight: '1.4',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        borderRadius: '5px'
                                    }}>
                                        <h2 style={{ fontSize: '14px', textDecoration: 'underline', marginTop: 0, textAlign: 'center' }}>
                                            {modal === 'contract' ? 'Contrato Digital de Participação' : 'REGRAS DO SORTEIO'}
                                        </h2>
                                        
                                        {modal === 'contract' ? (
                                            <>
                                                <p>Este Contrato Digital de Participação em Rifa do Ivan é celebrado entre Zanoth Tecnologia 46.118.941/0001-25 e o participante da rifa.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>1. Descrição do Serviço</h5>
                                                <p>1.1. O Organizador conduzirá uma rifa online, na qual os Participantes poderão adquirir números para concorrer a prêmios especificados.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>2. Condições de Participação</h5>
                                                <p>Os Participantes concordam em cumprir as seguintes condições:</p>
                                                <p>2.1. Os Participantes devem ser maiores de idade, conforme as leis do seu país de residência.</p>
                                                <p>2.2. Os Participantes devem adquirir um ou mais números de rifa conforme as regras estabelecidas pelo Organizador.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>3. Cancelamento do Sorteio</h5>
                                                <p>O Organizador se reserva o direito de cancelar o sorteio por motivos justificáveis, incluindo, mas não se limitando a:</p>
                                                <p>3.1. Incapacidade de atingir um número mínimo de participantes.</p>
                                                <p>3.2. Circunstâncias imprevistas, como desastres naturais, emergências de saúde pública ou outras situações fora do controle do Organizador.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>4. Devolução do Dinheiro</h5>
                                                <p>4.1. No caso de cancelamento do sorteio, o Organizador se compromete a reembolsar integralmente todos os Participantes que adquiriram números de rifa. O reembolso será processado automaticamente através do mesmo método de pagamento utilizado pelo Participante para adquirir os números de rifa.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>5. Responsabilidades do Organizador</h5>
                                                <p>O Organizador se compromete a:</p>
                                                <p>5.1. Conduzir o sorteio de forma justiça e transparente.</p>
                                                <p>5.2 Garantir a segurança e confidencialidade das informações dos Participantes.</p>
                                                <p>5.3. Cumprir todas as leis e regulamentos aplicáveis relacionados à realização de rifas online.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>6. Responsabilidades dos Participantes</h5>
                                                <p>Os Participantes concordam em:</p>
                                                <p>6.1. Adquirir números de rifa de forma ética e respeitosa.</p>
                                                <p>6.2. Respeitar todas as regras e regulamentos estabelecidos pelo Organizador.</p>
                                                <p>6.3. Aceitar as decisões do Organizador como definitivas e vinculativas.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>7. Proteção de Dados</h5>
                                                <p>7.1. O Organizador concorda em proteger e manter confidenciais todas as informações pessoais fornecidas pelos Participantes durante o processo de participação na rifa. Essas informações serão utilizadas exclusivamente para os fins relacionados à rifa e não serão compartilhadas com terceiros sem consentimento prévio dos Participantes.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>8. Taxas de Transação e Arrecadação</h5>
                                                <p>8.1. O Participante está ciente de que as transações via PIX podem estar sujeitas a taxas de processamento impostas pela plataforma financeira intermediária (Asaas ou similar).</p>
                                                <p>8.2. Devido a essas possíveis taxas retidas na fonte por transação, o montante final arrecadado pelo Organizador pode não corresponder exatamente à soma bruta dos valores pagos pelos Participantes, sendo o valor líquido destinado ao propósito da rifa após as devidas deduções operacionais da plataforma.</p>

                                                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>9. Disposições Gerais</h5>
                                                <p>9.1. Este Contrato constitui o acordo integral entre o Organizador e os Participantes e substitui todos os acordos anteriores ou contemporâneos relacionados ao assunto aqui discutido.</p>
                                                <p>9.2. Ao clicar no botão "Aceito os termos do contrato digital" ou realizar qualquer ação indicando aceitação deste Contrato durante o processo de participação na rifa, o Participante concorda em cumprir os termos e condições deste Contrato.</p>
                                                <p>9.3. Este Contrato é válido e eficaz a partir da data em que o Participante realiza a sua participação na rifa.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>1. Regras gerais do sorteio</strong></p>
                                                <p>1.1 Para concorrer ao sorteio o sr(a). deverá fazer a adesão de pelo menos um bilhete.</p>
                                                <p>1.2 Cada bilhete tem o preço de R$ 5,00 e lhe conferirá o direito de concorrer ao sorteio.</p>
                                                <p>1.3 Você pode comprar quantos bilhetes quiser, aumentando suas chances de ganhar.</p>
                                                <p>1.4 O sorteio não possui data fixa. O sorteio será realizado assim que a meta mínima de 500 (quinhentos) bilhetes vendidos for alcançada.</p>

                                                <p><strong>2. Do pagamento</strong></p>
                                                <p>2.1 O pagamento poderá ser feito via PIX ou presencialmente após o envio do formulário.</p>
                                                <p>2.2 Em caso de pagamento presencial, o sr(a). deverá entrar em contato com o organizador para validar sua participação.</p>

                                                <p><strong>3. Da efetivação</strong></p>
                                                <p>3.1 Uma vez o pagamento efetuado, o sr(a). receberá o comprovante da sua participação, contendo os números com os quais concorrerá.</p>

                                                <p><strong>4. Do prêmio</strong></p>
                                                <p>4.1 O prêmio será correspondente a 50% (cinquenta por cento) do valor total arrecadado com a venda dos bilhetes.</p>
                                                <p>4.2 O vencedor será contactado por meio do número de telefone para confirmar a transferência do prêmio via PIX.</p>
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
