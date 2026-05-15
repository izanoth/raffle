import { useState, useEffect } from 'preact/hooks';
import { 
    Trophy, 
    Video, 
    Calendar, 
    Hash, 
    Star, 
    Loader2, 
    CheckCircle2, 
    ExternalLink,
    Sparkles,
    Medal,
    MessageCircle,
    X,
    Play
} from 'lucide-preact';
import { useLocation } from 'preact-iso';
import { ContactModal } from './Home/components/ContactModal';
import '@styles';

export function Finished() {
    const { route } = useLocation();
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContact, setShowContact] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        fetchFinishedRaffle();
    }, []);

    const fetchFinishedRaffle = async () => {
        try {
            const response = await fetch('/api/raffle/finished');
            const data = await response.json();
            setRaffle(data);
        } catch (error) {
            console.error('Error fetching finished raffle:', error);
        } finally {
            setLoading(false);
        }
    };

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!raffle) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="modern-card p-12 max-w-lg space-y-6">
                    <div className="bg-slate-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                        <Star size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Novidades em Breve</h1>
                    <p className="text-slate-500 font-medium">Ainda não temos resultados para exibir por aqui, mas logo teremos um novo ganhador!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-12 animate-fade-in">
                
                {/* Header with Logo and Contact */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/60">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                            <img src="/img/rifadoivan.png" alt="Rifa do Ivan" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 leading-none">Rifa do Ivan</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sorteio Transparente</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowContact(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        <MessageCircle size={18} /> Falar com Ivan
                    </button>
                </div>

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-emerald-100 shadow-sm">
                        <CheckCircle2 size={16} /> Sorteio Realizado com Sucesso
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                            Último <span className="text-blue-600">Ganhador</span>
                        </h1>
                    </div>
                </div>

                {/* Main celebratory card */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    
                    <div className="modern-card relative p-1 md:p-1.5 bg-slate-100">
                        <div className="bg-slate-900 rounded-[1.25rem] md:rounded-[1.4rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="receipt-pattern opacity-30"></div>
                            </div>

                            <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center space-y-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-b from-blue-500 to-indigo-600 p-8 rounded-[2.5rem] shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
                                        <Trophy size={64} className="text-white" />
                                        <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-bounce" size={24} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.4em]">
                                        <Medal size={14} /> O Grande Sortudo(a)
                                    </div>
                                    <h2 className="text-5xl md:text-8xl font-black italic text-white tracking-tighter uppercase leading-none">
                                        {raffle.winner?.name}
                                    </h2>
                                    
                                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                                        <span className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-slate-300 font-mono text-xs border border-slate-700/50 flex items-center gap-2">
                                            <Hash size={12} className="text-blue-400" /> ID: {raffle.winner?.id.toString().padStart(6, '0')}
                                        </span>
                                        <span className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-slate-300 font-mono text-xs border border-slate-700/50 flex items-center gap-2">
                                            <Calendar size={12} className="text-blue-400" /> {new Date(raffle.drawDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full max-w-md py-8 border-y border-white/5 space-y-2">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Referente ao Prêmio</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-200">{raffle.title}</h3>
                                </div>

                                {raffle.videoUrl && (
                                    <button 
                                        onClick={() => setShowVideo(true)}
                                        className="group/btn bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                                    >
                                        <Play size={24} className="fill-slate-900" /> ASSISTIR SORTEIO
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Rifa do Ivan • Conectando Pessoas, Gerando Sorte</p>
                </div>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <button 
                            onClick={() => setShowVideo(false)}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>
                        <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${getYoutubeId(raffle.videoUrl)}?autoplay=1`}
                            title="Sorteio Rifa do Ivan"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {showContact && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="modern-card w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Falar com Ivan</span>
                            <button onClick={() => setShowContact(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <ContactModal onClose={() => setShowContact(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
