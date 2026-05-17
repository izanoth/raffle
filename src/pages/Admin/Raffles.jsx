import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    ChevronLeft, 
    Plus, 
    Edit2, 
    Trash2, 
    Trophy, 
    CheckCircle2, 
    XCircle,
    Calendar,
    Hash,
    Loader2,
    Video,
    Zap,
    X,
    MessageCircle
} from 'lucide-preact';
import { ContactModal } from '../Home/components/ContactModal';
import '@styles';

export function Raffles() {
    const { route } = useLocation();
    const [raffles, setRaffles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Draw state
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawWinner, setDrawWinner] = useState(null);
    const [displayNumber, setDisplayNumber] = useState('????');
    const [drawingRaffleId, setDrawingRaffleId] = useState(null);

    const [currentRaffle, setCurrentRaffle] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        title: '',
        prize: '',
        endDate: '',
        status: 'ACTIVE',
        videoUrl: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchRaffles();
    }, []);

    const fetchRaffles = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/raffles');
            const data = await response.json();
            setRaffles(data);
        } catch (error) {
            console.error('Error fetching raffles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (raffle = null) => {
        if (raffle) {
            setCurrentRaffle(raffle);
            setFormData({
                number: raffle.number || '',
                title: raffle.title || '',
                prize: raffle.prize || '',
                endDate: raffle.endDate ? new Date(raffle.endDate).toISOString().split('T')[0] : '',
                status: raffle.status,
                videoUrl: raffle.videoUrl || ''
            });
        } else {
            setCurrentRaffle(null);
            setFormData({
                number: '',
                title: '',
                prize: '',
                endDate: '',
                status: 'ACTIVE',
                videoUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = currentRaffle ? `/api/admin/raffles/${currentRaffle.id}` : '/api/admin/raffles';
        const method = currentRaffle ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                fetchRaffles();
            }
        } catch (error) {
            console.error('Error saving raffle:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Deseja realmente excluir esta rifa? Esta ação não pode ser desfeita.')) return;
        try {
            const response = await fetch(`/api/admin/raffles/${id}`, { method: 'DELETE' });
            if (response.ok) fetchRaffles();
        } catch (error) {
            console.error('Error deleting raffle:', error);
        }
    };

    const startDraw = (raffle) => {
        if (!raffle.videoUrl) {
            alert('⚠️ Atenção: Você precisa adicionar o link do vídeo do sorteio antes de finalizar a rifa.');
            handleOpenModal(raffle);
            return;
        }
        setDrawingRaffleId(raffle.id);
        setIsDrawing(true);
        setDrawWinner(null);
        setDisplayNumber('????');
    };

    const handleRealDraw = async () => {
        if (!confirm('Deseja iniciar a animação e selecionar o ganhador agora?')) return;
        
        try {
            const response = await fetch(`/api/admin/raffles/${drawingRaffleId}/draw`, { method: 'POST' });
            const data = await response.json();
            
            if (data.success) {
                let count = 0;
                const interval = setInterval(() => {
                    setDisplayNumber(Math.floor(1000 + Math.random() * 9000).toString());
                    count += 50;
                    if (count >= 4000) { 
                        clearInterval(interval);
                        setDrawWinner(data.winner);
                        setDisplayNumber(data.winner.ticket);
                        fetchRaffles();
                    }
                }, 50);
            } else {
                alert(data.error);
                setIsDrawing(false);
            }
        } catch (error) {
            console.error('Error drawing raffle:', error);
            setIsDrawing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => route('/admin/panel')}
                            className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <img src="/img/rifadoivan.png" className="w-8 h-8 rounded-lg" alt="Logo" />
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gerenciar Rifas</h1>
                            </div>
                            <p className="text-slate-500 font-medium">Controle total dos sorteios e resultados</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleOpenModal()}
                            disabled={raffles.some(r => r.status === 'ACTIVE')}
                            className={`${raffles.some(r => r.status === 'ACTIVE') ? 'bg-slate-300 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'} text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg flex items-center gap-2`}
                        >
                            <Plus size={20} /> Nova Rifa
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {raffles.map(raffle => (
                            <div key={raffle.id} className="modern-card overflow-hidden flex flex-col">
                                <div className={`p-4 flex justify-between items-center ${
                                    raffle.status === 'ACTIVE' ? 'bg-blue-50' : 
                                    raffle.status === 'FINISHED' ? 'bg-emerald-50' : 'bg-slate-100'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <Hash size={16} className="text-slate-400" />
                                        <span className="font-bold text-slate-700">{raffle.number || 'N/A'}</span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                                        raffle.status === 'ACTIVE' ? 'bg-blue-200 text-blue-700' : 
                                        raffle.status === 'FINISHED' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {raffle.status}
                                    </span>
                                </div>
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{raffle.title || 'Rifa sem título'}</h3>
                                    <p className="text-xs text-blue-600 font-bold mb-4 px-3 py-1 bg-blue-50 rounded-lg w-fit">
                                        {raffle.prize || 'Sem prêmio definido'}
                                    </p>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={16} />
                                            <span>Fim: {raffle.endDate ? new Date(raffle.endDate).toLocaleDateString() : 'Não definido'}</span>
                                        </div>
                                        {raffle.winner && (
                                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                                                <Trophy size={16} />
                                                <span>Ganhador: {raffle.winner.name}</span>
                                            </div>
                                        )}
                                        {raffle.videoUrl ? (
                                            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                <Video size={16} />
                                                <span className="truncate max-w-[150px]">{raffle.videoUrl}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-red-400 italic">
                                                <Video size={16} />
                                                <span>Sem vídeo do sorteio</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleOpenModal(raffle)}
                                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
                                        >
                                            <Edit2 size={16} /> Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(raffle.id)}
                                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    </div>
                                    
                                    {raffle.status === 'ACTIVE' && (
                                        <button 
                                            onClick={() => startDraw(raffle)}
                                            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Trophy size={18} /> FINALIZAR E SORTEAR
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">{currentRaffle ? 'Editar Rifa' : 'Nova Rifa'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                    {currentRaffle ? 'Identificador / Número' : 'Identificador (Automático)'}
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.number}
                                    onChange={e => setFormData({...formData, number: e.target.value})}
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none ${!currentRaffle ? 'opacity-50' : ''}`}
                                    placeholder={currentRaffle ? "Ex: 001" : "Será gerado automaticamente"}
                                    disabled={!currentRaffle}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título da Rifa</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none"
                                    placeholder="Ex: Rifa de Verão #01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição do Prêmio</label>
                                <input 
                                    type="text" 
                                    value={formData.prize}
                                    onChange={e => setFormData({...formData, prize: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none"
                                    placeholder="Ex: iPhone 15 Pro Max"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Data de Encerramento</label>
                                <input 
                                    type="date" 
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            {currentRaffle && (
                                <>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none"
                                        >
                                            <option value="ACTIVE">Ativa</option>
                                            <option value="FINISHED">Finalizada</option>
                                            <option value="CANCELLED">Cancelada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Link do Vídeo do Sorteio (Obrigatório para finalizar)</label>
                                        <input 
                                            type="url" 
                                            value={formData.videoUrl}
                                            onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-blue-500 transition-all outline-none"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </>
                            )}
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-4"
                            >
                                SALVAR ALTERAÇÕES
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Draw Animation Modal */}
            {isDrawing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
                    <div className="modern-card p-8 bg-slate-900 text-white relative overflow-hidden max-w-2xl w-full border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <button onClick={() => setIsDrawing(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        
                        <div className="relative z-10 h-full flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-emerald-600 p-2 rounded-xl">
                                    <Trophy size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Sorteio Digital</h3>
                                    <p className="text-slate-400 text-sm italic">"Que a sorte esteja com quem mais precisa hoje!"</p>
                                </div>
                            </div>

                            <div className="py-12 flex flex-col items-center">
                                <div className={`text-7xl md:text-9xl font-black font-mono tracking-widest mb-10 p-10 rounded-3xl border-4 ${
                                    !drawWinner ? 'border-slate-700 text-slate-700 animate-pulse' : 'border-emerald-500 text-emerald-400 shadow-2xl shadow-emerald-500/20'
                                } bg-slate-800/50`}>
                                    {displayNumber}
                                </div>

                                {drawWinner ? (
                                    <div className="text-center animate-fade-in space-y-4">
                                        <p className="text-emerald-400 font-black text-2xl uppercase tracking-widest">🎉 PARABÉNS! 🎉</p>
                                        <h4 className="text-4xl font-black italic">{drawWinner.name}</h4>
                                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                                            <p className="text-slate-400 font-mono bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">ID: {drawWinner.clientId.toString().padStart(6, '0')}</p>
                                            <p className="text-slate-400 font-mono bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">WhatsApp: {drawWinner.phone}</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsDrawing(false)}
                                            className="mt-6 bg-white text-slate-900 font-black px-10 py-4 rounded-2xl hover:bg-slate-100 transition-all"
                                        >
                                            CONCLUIR E FECHAR
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleRealDraw}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 px-12 rounded-2xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex items-center gap-3 text-xl"
                                    >
                                        <Zap size={24} /> INICIAR SORTEIO AGORA
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
