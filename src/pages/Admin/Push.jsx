import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    Send, 
    ArrowLeft, 
    Bell, 
    Users, 
    CheckCircle2, 
    AlertCircle,
    Loader2,
    Monitor,
    Smartphone,
    Globe,
    Calendar,
    Search
} from 'lucide-preact';
import '@styles';

export function Push() {
    const { route } = useLocation();
    const [title, setTitle] = useState('Rifa do Ivan');
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [status, setStatus] = useState({ type: null, msg: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('/api/admin/push/subscriptions');
            const data = await response.json();
            setSubscriptions(data);
        } catch (error) {
            console.error('Error fetching push subscriptions:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message) return;
        if (!confirm('Deseja disparar esta notificação para todos os inscritos selecionados?')) return;

        setLoading(true);
        setStatus({ type: null, msg: '' });

        try {
            const response = await fetch('/api/admin/push/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    body: message,
                    filter
                })
            });

            const data = await response.json();
            if (data.success) {
                setStatus({ 
                    type: 'success', 
                    msg: `Sucesso! Notificação enviada para ${data.count} dispositivos.` 
                });
                setMessage('');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                msg: 'Erro ao enviar notificações: ' + error.message 
            });
        } finally {
            setLoading(false);
        }
    };

    const getDeviceIcon = (ua) => {
        if (!ua) return <Globe size={16} />;
        const lowUA = ua.toLowerCase();
        if (lowUA.includes('mobi') || lowUA.includes('android') || lowUA.includes('iphone')) return <Smartphone size={16} />;
        return <Monitor size={16} />;
    };

    const parseUA = (ua) => {
        if (!ua) return 'Legado / Desconhecido';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iPhone')) return 'iOS';
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Macintosh')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        return 'Navegador';
    };

    const filteredSubscriptions = subscriptions.filter(sub => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = (sub.email?.toLowerCase().includes(term) || 
                               sub.userAgent?.toLowerCase().includes(term) ||
                               sub.ip?.includes(term));
        
        if (filter === 'non-participated') return matchesSearch && !sub.participated;
        if (filter === 'participated') return matchesSearch && sub.participated;
        return matchesSearch;
    });

    const getPredefinedMessages = () => {
        if (filter === 'non-participated') return [
            { label: 'Incentivo', text: 'Vi que você ainda não garantiu sua cota. Que tal tentar a sorte agora?' },
            { label: 'Escassez', text: 'Últimas cotas disponíveis! Garanta já a sua participação antes que acabe.' }
        ];
        if (filter === 'participated') return [
            { label: 'Agradecimento', text: 'Obrigado por participar! Fique atento às notificações para o resultado.' },
            { label: 'Mais Chance', text: 'Sabia que você pode aumentar suas chances? Compre mais cotas e turbine seu bilhete!' }
        ];
        return [
            { label: 'Lembrete Geral', text: 'O sorteio está chegando! Não perca a chance de participar.' },
            { label: 'Resultado', text: 'O grande dia chegou! O resultado sairá em breve. Fique atento.' }
        ];
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => route('/admin/panel')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={20} /> Voltar ao Painel
                </button>

                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Bell className="text-blue-600" /> Push Notifications
                        </h1>
                        <p className="text-slate-500 font-medium">Controle e envio de notificações para {subscriptions.length} inscritos.</p>
                    </div>
                    <div className="bg-blue-600 px-6 py-3 rounded-2xl text-white flex items-center gap-3 shadow-lg shadow-blue-500/20">
                        <Users size={20} />
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-70">Total de Inscritos</p>
                            <p className="text-xl font-black leading-tight">{subscriptions.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Send Form */}
                        <div className="modern-card p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Send size={20} className="text-blue-600" /> Disparar Mensagem
                            </h2>
                            <form onSubmit={handleSend} className="space-y-6">
                                <div>
                                    <label className="label-text">Título da Notificação</label>
                                    <input 
                                        type="text"
                                        value={title}
                                        onInput={(e) => setTitle(e.target.value)}
                                        className="input-field !pl-4"
                                        placeholder="Ex: Novidade no Sorteio!"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label-text">Mensagem / Corpo</label>
                                    <textarea 
                                        value={message}
                                        onInput={(e) => setMessage(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 min-h-[120px]"
                                        placeholder="Escreva sua mensagem aqui..."
                                        required
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {getPredefinedMessages().map(msg => (
                                            <button 
                                                key={msg.label}
                                                type="button"
                                                onClick={() => setMessage(msg.text)}
                                                className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg transition-colors"
                                            >
                                                + {msg.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="label-text">Público Alvo</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFilter('all')}
                                            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border transition-all ${
                                                filter === 'all' 
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
                                                    : 'bg-white border-slate-200 text-slate-500'
                                            }`}
                                        >
                                            <Users size={20} />
                                            <span className="text-[10px] uppercase font-bold">Todos</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('non-participated')}
                                            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border transition-all ${
                                                filter === 'non-participated' 
                                                    ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold' 
                                                    : 'bg-white border-slate-200 text-slate-500'
                                            }`}
                                        >
                                            <AlertCircle size={20} />
                                            <span className="text-[10px] uppercase font-bold">Leads</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('participated')}
                                            className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border transition-all ${
                                                filter === 'participated' 
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                                                    : 'bg-white border-slate-200 text-slate-500'
                                            }`}
                                        >
                                            <CheckCircle2 size={20} />
                                            <span className="text-[10px] uppercase font-bold">Clientes</span>
                                        </button>
                                    </div>
                                </div>

                                {status.msg && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                                        status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                    }`}>
                                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        <p className="font-medium text-sm">{status.msg}</p>
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={loading || !message}
                                    className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                                >
                                    {loading ? (
                                        <><Loader2 className="animate-spin" /> Enviando...</>
                                    ) : (
                                        <><Send size={20} /> DISPARAR NOTIFICAÇÃO</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="modern-card p-6 bg-blue-600 text-white">
                            <h4 className="font-black mb-2 flex items-center gap-2">
                                <AlertCircle size={18} /> Dica do Admin
                            </h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Notificações push são uma ferramenta poderosa. Use com moderação para não incomodar seus usuários.
                            </p>
                        </div>

                        {/* List of Subscriptions */}
                        <div className="modern-card overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-black text-slate-900 flex items-center gap-2">
                                    <Users size={18} className="text-slate-400" /> Logs de Inscrições
                                </h3>
                                <div className="mt-3 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="Filtrar..."
                                        value={searchTerm}
                                        onInput={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto">
                                {filteredSubscriptions.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {filteredSubscriptions.map(sub => (
                                            <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
                                                            {getDeviceIcon(sub.userAgent)}
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-sm">
                                                            {sub.email || 'Anônimo'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                                                        sub.participated ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {sub.participated ? 'CLIENTE' : 'LEAD'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                        <Monitor size={10} />
                                                        <span className="truncate max-w-[120px]">{parseUA(sub.userAgent)}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <Calendar size={10} />
                                                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-[9px] text-slate-300 font-mono truncate">
                                                        IP: {sub.ip || '0.0.0.0'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm italic">
                                        Nenhuma inscrição encontrada.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

