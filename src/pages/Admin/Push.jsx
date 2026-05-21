import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    Send, 
    ArrowLeft, 
    Bell, 
    Users, 
    CheckCircle2, 
    AlertCircle,
    Loader2
} from 'lucide-preact';
import '@styles';

export function Push() {
    const { route } = useLocation();
    const [title, setTitle] = useState('Rifa do Ivan');
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, nonParticipated: 0 });
    const [status, setStatus] = useState({ type: null, msg: '' });

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchPushStats();
    }, []);

    const fetchPushStats = async () => {
        try {
            const response = await fetch('/api/admin/stats'); // Reusing stats or could add a specific one
            // Note: For now we'll just show the message field. 
            // If needed we can add a specific endpoint for push stats.
        } catch (error) {
            console.error('Error fetching push stats:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message) return;
        if (!confirm('Deseja disparar esta notificação para todos os inscritos selecionados?')) return;

        setLoading(true);
        setStatus({ type: null, msg: '' });

        try {
            const response = await fetch('/api/push/broadcast', {
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

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => route('/admin/panel')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={20} /> Voltar ao Painel
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Bell className="text-blue-600" /> Disparo Customizado
                    </h1>
                    <p className="text-slate-500 font-medium">Envie notificações push para seus inscritos em tempo real.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="modern-card p-8">
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
                                    <button 
                                        type="button"
                                        onClick={() => setMessage('O sorteio está chegando! Não perca a chance de participar.')}
                                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        + Lembrete Geral
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setMessage('Últimas cotas disponíveis! Garanta já a sua participação.')}
                                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        + Últimas Cotas
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setMessage('Resultado saindo em breve! Fique atento às notificações.')}
                                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        + Resultado
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Público Alvo</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFilter('all')}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                                            filter === 'all' 
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
                                                : 'bg-white border-slate-200 text-slate-500'
                                        }`}
                                    >
                                        <Users size={20} /> Todos os Inscritos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilter('non-participated')}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                                            filter === 'non-participated' 
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
                                                : 'bg-white border-slate-200 text-slate-500'
                                        }`}
                                    >
                                        <AlertCircle size={20} /> Apenas Pendentes
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

                    <div className="modern-card p-6 bg-blue-600 text-white">
                        <h4 className="font-black mb-2 flex items-center gap-2">
                            <AlertCircle size={18} /> Dica do Admin
                        </h4>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Mantenha as mensagens curtas e objetivas. Notificações com mais de 100 caracteres podem ser cortadas em alguns dispositivos móveis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
