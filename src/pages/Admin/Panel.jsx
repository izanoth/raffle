import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    Users, 
    Zap, 
    Trophy, 
    TrendingUp, 
    LogOut, 
    ChevronRight,
    Loader2,
    Calendar,
    Hash,
    FileText,
    RefreshCw
} from 'lucide-preact';
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
                setIsSpinning(true);
                let count = 0;
                const interval = setInterval(() => {
                    setDisplayNumber(Math.floor(1000 + Math.random() * 9000).toString());
                    count += 50;
                    if (count >= 4000) { 
                        clearInterval(interval);
                        setIsSpinning(false);
                        setWinner(data.winner);
                        setDisplayNumber(data.winner.ticket);
                        setLoadingDraw(false);
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

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
                        <p className="text-slate-500 font-medium">Bem-vindo, {typeof window !== 'undefined' ? sessionStorage.getItem('admin') : 'Admin'}</p>
                    </div>
                    <button 
                        onClick={fetchStats}
                        className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        title="Total de Registros" 
                        value={stats.registers} 
                        icon={<Users className="text-blue-500" />} 
                        color="bg-blue-50"
                    />
                    <StatCard 
                        title="Pagamentos Confirmados" 
                        value={stats.payments} 
                        icon={<Zap className="text-emerald-500" />} 
                        color="bg-emerald-50"
                        highlight="text-emerald-600"
                    />
                    <StatCard 
                        title="Pendentes Asaas" 
                        value={stats.asaasIntents} 
                        icon={<TrendingUp className="text-amber-500" />} 
                        color="bg-amber-50"
                    />
                    <StatCard 
                        title="Total de Intenções" 
                        value={stats.totalIntents} 
                        icon={<Calendar className="text-indigo-500" />} 
                        color="bg-indigo-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sorteio Card */}
                    <div className="lg:col-span-2 modern-card p-8 bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-600 p-2 rounded-xl">
                                    <Trophy size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Realizar Sorteio</h3>
                                    <p className="text-slate-400 text-sm">Selecione aleatoriamente um ganhador entre os pagos</p>
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col items-center justify-center py-12">
                                <div className={`text-6xl md:text-8xl font-black font-mono tracking-widest mb-8 p-8 rounded-3xl border-4 ${
                                    isSpinning ? 'border-slate-700 text-slate-700 animate-pulse' : 'border-blue-500 text-blue-400 shadow-2xl shadow-blue-500/20'
                                } bg-slate-800/50`}>
                                    {displayNumber}
                                </div>

                                {winner && !isSpinning && (
                                    <div className="text-center animate-fade-in space-y-2">
                                        <p className="text-emerald-400 font-black text-2xl uppercase tracking-widest mb-4">🏆 Ganhador Encontrado! 🏆</p>
                                        <h4 className="text-3xl font-black">{winner.name}</h4>
                                        <p className="text-slate-400 font-mono">ID: {winner.clientId.toString().padStart(6, '0')} | Tel: {winner.phone}</p>
                                    </div>
                                )}

                                {!isSpinning && !winner && (
                                    <div className="text-center text-slate-500 max-w-sm italic">
                                        Aguardando comando para iniciar o sorteio digital.
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleDraw}
                                disabled={loadingDraw}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-3 text-lg"
                            >
                                {loadingDraw ? (
                                    <><Loader2 className="animate-spin" /> Sorteando...</>
                                ) : (
                                    <><Zap size={24} /> REALIZAR SORTEIO AGORA</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ações do Sistema</h4>
                        <NavAction 
                            icon={<Users className="text-blue-500" />} 
                            title="Lista de Clientes" 
                            desc="Ver todos os participantes e pagamentos"
                            onClick={() => route('/admin/list')}
                        />
                        <NavAction 
                            icon={<Hash className="text-indigo-500" />} 
                            title="Gerador de Hash" 
                            desc="Criar senhas criptografadas para admin"
                            onClick={() => route('/admin/hasher')}
                        />
                        <NavAction 
                            icon={<FileText className="text-emerald-500" />} 
                            title="Gerar Comprovante" 
                            desc="Emitir layout de comprovante manual"
                            onClick={() => route('/admin/success-preview')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, highlight = "text-slate-900" }) {
    return (
        <div className="modern-card p-6 flex items-center gap-5">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className={`text-3xl font-black ${highlight}`}>{value}</p>
            </div>
        </div>
    );
}

function NavAction({ icon, title, desc, onClick }) {
    return (
        <button 
            onClick={onClick}
            className="w-full modern-card p-6 flex items-center gap-4 hover:border-blue-300 transition-all text-left group"
        >
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                {icon}
            </div>
            <div className="flex-grow">
                <h5 className="font-bold text-slate-900 leading-none mb-1.5">{title}</h5>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </button>
    );
}
