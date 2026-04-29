import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { maskPhone } from '../../helpers/utils';
import { Intro } from './components/Intro';
import { Contract } from './components/Contract';
import { Rules } from './components/Rules';
import { Playful } from './components/Playful';
import { 
    Ticket, 
    User, 
    Mail, 
    Phone, 
    ChevronRight, 
    Info, 
    BarChart3, 
    RefreshCw, 
    ShieldCheck, 
    Plus, 
    Minus,
    Clock,
    X,
    Maximize2,
    MinusSquare,
    CalendarDays
} from 'lucide-preact';
import '@styles';

/**
 * DOCUMENTAÇÃO DE REGRAS DE NEGÓCIO:
 * 1. Data de Início Estática: 29 de Abril de 2026.
 * 2. Prazo Limite: 45 dias a partir do início.
 * 3. Meta de Bilhetes: 52 unidades.
 * 4. Lógica do Sorteio: O sorteio ocorre ao atingir 52 bilhetes OU 45 dias.
 * 5. Se a meta for batida antes dos 45 dias, o sistema continua aceitando bilhetes até o fim do prazo.
 */
const START_DATE = new Date('2026-04-29T00:00:00');
const RAFFLE_DURATION_DAYS = 45;
const GOAL_TICKETS = 52;

function SystemTimer() {
    const [timer, setTimer] = useState('00:00:00');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTimer(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span className="font-mono">{timer}</span>;
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
    const [daysRemaining, setDaysRemaining] = useState(RAFFLE_DURATION_DAYS);

    useEffect(() => {
        // Cálculo do prazo restante
        const calculateTime = () => {
            const now = new Date();
            const end = new Date(START_DATE);
            end.setDate(end.getDate() + RAFFLE_DURATION_DAYS);
            
            const diffTime = end - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(Math.max(0, diffDays));
        };

        calculateTime();
        const timer = setInterval(calculateTime, 3600000); // Atualiza a cada hora
        return () => clearInterval(timer);
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

    const handleSystemControl = (type) => {
        const contents = {
            close: {
                title: 'Ação Bloqueada',
                message: 'O sistema detectou uma tentativa de saída sem garantir sua sorte. Por motivos de "segurança mística", o botão de fechar foi temporariamente redirecionado para a persistência.'
            },
            minimize: {
                title: 'Modo Foco',
                message: 'Minimizar a sorte não é suportado nesta versão. Mantenha a vibração positiva em tela cheia para melhores resultados.'
            },
            maximize: {
                title: 'Resolução Adaptativa',
                message: 'O sistema já está operando na "Resolução da Sorte". Aumentar a janela não aumentará o prêmio, mas sua participação sim!'
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
        if (!formData.name) newErrors.name = 'Nome é obrigatório';
        if (!formData.email) newErrors.email = 'E-mail é obrigatório';
        if (!formData.phone) newErrors.phone = 'WhatsApp é obrigatório';
        if (!formData.terms) newErrors.terms = 'Você precisa aceitar os termos';

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
        <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
            {/* Main Container */}
            <div className="w-full max-w-xl animate-fade-in">
                
                {/* Modern Header Area */}
                <div className="mb-8 flex flex-col md:flex-row items-center gap-6 bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/60">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 group hover:rotate-3 transition-transform">
                        <img src="/img/rifadoivan.png" alt="Rifa do Ivan" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rifa do Ivan</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                <Clock size={12} /> <SystemTimer />
                            </span>
                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                <ShieldCheck size={12} /> 100% Seguro
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={openStatus}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        <BarChart3 size={16} />
                        Status
                    </button>
                </div>

                {activeWindow === 'form' ? (
                    <div className="modern-card">
                        {/* Fake Window Controls (Modern) */}
                        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-3 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Ticket size={14} className="text-blue-500" />
                                Participar do Sorteio
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => handleSystemControl('minimize')} className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400"><MinusSquare size={14} /></button>
                                <button onClick={() => handleSystemControl('maximize')} className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400"><Maximize2 size={14} /></button>
                                <button onClick={() => handleSystemControl('close')} className="w-6 h-6 rounded-full hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors"><X size={14} /></button>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <div className="bg-blue-600 p-2 rounded-xl text-white">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">Prêmio: 50% do Arrecadado</h4>
                                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                                        Garanta sua chance e ajude-me nos estudos. <a href="#" onClick={openRules} className="underline font-bold">Ver regras</a>.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-1 gap-5">
                                    <div>
                                        <label className="label-text">Nome Completo</label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                            <input
                                                className="input-field"
                                                type="text"
                                                name="name"
                                                placeholder="Como quer ser chamado?"
                                                value={formData.name}
                                                onInput={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="label-text">E-mail</label>
                                        <div className="relative flex items-center">
                                            <Mail size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                            <input
                                                className="input-field"
                                                type="email"
                                                name="email"
                                                placeholder="seu@email.com"
                                                value={formData.email}
                                                onInput={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="label-text">WhatsApp</label>
                                        <div className="relative flex items-center">
                                            <Phone size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                                            <input
                                                className="input-field"
                                                type="tel"
                                                name="phone"
                                                placeholder="(00) 00000-0000"
                                                value={formData.phone}
                                                onInput={handleChange}
                                                required
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <label className="label-text mb-4">Quantidade de Bilhetes</label>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                            <button 
                                                type="button" 
                                                onClick={() => handleUnitChange(-1)}
                                                className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="text-lg font-black text-slate-900 w-8 text-center">{formData.units}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleUnitChange(1)}
                                                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors shadow-md shadow-blue-200"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-2xl font-black text-blue-600">R$ {(formData.units * 5).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 py-2">
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            id="terms"
                                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                            checked={formData.terms}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-slate-600 leading-snug cursor-pointer">
                                        Eu li e aceito os <a href="#" onClick={openContract} className="text-blue-600 font-bold hover:underline">termos do contrato digital</a> de participação.
                                    </label>
                                </div>

                                {errors.submit && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                        {errors.submit}
                                    </div>
                                )}

                                <button 
                                    className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4" 
                                    type="submit" 
                                    disabled={!formData.terms}
                                >
                                    Garantir minha Sorte
                                    <ChevronRight size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="modern-card animate-fade-in">
                        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <BarChart3 size={18} className="text-blue-500" />
                                Status da Rifa
                            </h2>
                            <button 
                                onClick={openParticipar}
                                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                            >
                                Voltar
                            </button>
                        </div>

                        <div className="p-8">
                            {loadingStatus ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-4">
                                    <RefreshCw className="text-blue-500 animate-spin" size={32} />
                                    <p className="text-slate-500 font-medium">Sincronizando dados...</p>
                                </div>
                            ) : raffleStatus ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <Ticket size={12} /> Bilhetes
                                            </p>
                                            <h3 className="text-2xl font-black text-slate-900">
                                                {raffleStatus.totalSold} <span className="text-sm text-slate-400 font-medium">/ {GOAL_TICKETS}</span>
                                            </h3>
                                        </div>
                                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <CalendarDays size={12} /> Prazo Restante
                                            </p>
                                            <h3 className="text-2xl font-black text-blue-700">
                                                {daysRemaining} <span className="text-sm font-medium opacity-60">dias</span>
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <div className="flex justify-between items-end mb-4">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Progresso da Meta</p>
                                            <p className="text-xl font-black text-blue-600">
                                                {Math.round((raffleStatus.totalSold / GOAL_TICKETS) * 100)}%
                                            </p>
                                        </div>
                                        
                                        <div className="h-4 bg-white rounded-full border border-slate-200 p-1 overflow-hidden shadow-inner">
                                            <div 
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                style={{ width: `${Math.min(100, (raffleStatus.totalSold / GOAL_TICKETS) * 100)}%` }}
                                            />
                                        </div>
                                        {raffleStatus.totalSold >= GOAL_TICKETS && (
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-3 text-center">
                                                Meta atingida! O sorteio ocorrerá ao fim do prazo.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 ml-1">Últimos Participantes</h4>
                                        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest sticky top-0">
                                                        <tr>
                                                            <th className="px-6 py-4">Participante</th>
                                                            <th className="px-6 py-4 text-right">Bilhetes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {raffleStatus.participants.map((p, i) => (
                                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <p className="font-bold text-slate-900 truncate max-w-[180px]">{p.email}</p>
                                                                    <p className="text-[10px] text-slate-400">{p.phone}</p>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black">
                                                                        {p.units}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {raffleStatus.participants.length === 0 && (
                                                            <tr>
                                                                <td colSpan="2" className="px-6 py-12 text-center text-slate-400 italic">
                                                                    Ninguém por aqui ainda. Seja o pioneiro!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="btn-secondary flex-grow flex items-center justify-center gap-2" onClick={fetchStatus}>
                                            <RefreshCw size={18} />
                                            Atualizar
                                        </button>
                                        <button className="btn-primary flex-grow" onClick={openParticipar}>
                                            Participar Agora
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-red-500 font-medium">Erro ao carregar dados.</p>
                                    <button className="mt-4 text-blue-600 font-bold" onClick={fetchStatus}>Tentar novamente</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <p className="mt-8 text-center text-slate-400 text-xs font-medium">
                    © 2024 Rifa do Ivan • Desenvolvido com foco e propósito
                </p>
            </div>

            {/* Modern Modal System */}
            {modal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className={`modern-card w-full max-h-[90vh] flex flex-col ${
                        (modal === 'playful' || modal === 'intro') ? 'max-w-xs' : 'max-w-2xl'
                    }`}>
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {modal === 'intro' ? 'Sistema' : 
                                 modal === 'contract' ? 'Contrato' : 
                                 modal === 'rules' ? 'Regras' : 'Aviso'}
                            </span>
                            <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
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
