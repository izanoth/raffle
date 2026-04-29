import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    Printer, 
    CheckCircle2, 
    MessageSquare, 
    PartyPopper,
    Home as HomeIcon,
    Ticket,
    Calendar,
    User,
    ArrowRight,
    X,
    AlertCircle
} from 'lucide-preact';
import '@styles';

export function Success() {
    const { route } = useLocation();
    const [client, setClient] = useState(null);
    const [bilhetes, setBilhetes] = useState([]);
    const [modal, setModal] = useState(null);
    const [playfulContent, setPlayfulContent] = useState({ title: '', message: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedClient = sessionStorage.getItem('new-client');
            
            if (!storedClient) {
                route('/');
                return;
            }
            const clientData = JSON.parse(storedClient);
            setClient(clientData);
            
            if (clientData.tickets) {
               try {
                   setBilhetes(JSON.parse(clientData.tickets));
               } catch(e) {
                   setBilhetes([]);
               }
            }
        }
    }, []);

    const handleSystemControl = (type) => {
        const contents = {
            close: {
                title: 'Comprovante Importante',
                message: 'Parar agora? Você ainda não salvou seu bilhete! O sistema recomenda imprimir ou salvar em PDF antes de sair, para garantir sua participação física e mental.'
            },
            minimize: {
                title: 'Sorte em Evidência',
                message: 'O sistema detectou que você está tentando esconder sua vitória. Mantenha os bilhetes visíveis para maximizar o Karma Digital.'
            },
            maximize: {
                title: 'Resolução da Vitória',
                message: 'Os bilhetes já estão renderizados com a máxima tecnologia. Maximizar agora causaria uma sobrecarga de entusiasmo.'
            }
        };
        setPlayfulContent(contents[type]);
        setModal('playful');
    };

    if (!client) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-500 font-bold">Carregando dados...</div>
        </div>
    );

    const handlePrint = () => {
        const originalTitle = document.title;
        const date = new Date();
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        const dateStr = `${d}${m}${y}`;
        const orderId = (client.id || '001').toString().padStart(3, '0');
        
        document.title = `rifa-do-ivan_pedido-no${orderId}_${dateStr}`;
        window.print();
        document.title = originalTitle;
    };

    const todayDate = new Date().toLocaleDateString('pt-BR');

    return (
        <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-full max-w-xl">
                
                {/* Header Section */}
                <div className="text-center mb-8 no-print">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-100 animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Sucesso!</h1>
                    <p className="text-slate-500 font-medium">Sua participação foi registrada com sucesso.</p>
                </div>

                {/* Modern Receipt Card */}
                <div className="modern-card relative overflow-hidden mb-8">
                    {/* Pattern Background for Receipt */}
                    <div className="receipt-pattern opacity-10 pointer-events-none"></div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-lg font-black uppercase tracking-widest opacity-80">Comprovante</h2>
                                <p className="text-3xl font-black">Rifa do Ivan</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Data</p>
                                <p className="font-bold text-sm">{todayDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center gap-1">
                                    <User size={10} /> Participante
                                </p>
                                <p className="font-bold text-sm truncate">{client.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Sorteio</p>
                                <p className="font-bold text-sm">#000000001</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white relative">
                        {/* Decorative side cuts for receipt look */}
                        <div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-700 translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"></div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-slate-100 flex-grow"></div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Seus Números</span>
                                <div className="h-px bg-slate-100 flex-grow"></div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {bilhetes.map((item) => (
                                    <div key={item} className="group relative">
                                        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <div className="relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center hover:border-blue-400 hover:bg-white transition-all">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket</p>
                                            <p className="text-2xl font-black text-slate-900">{item}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {bilhetes.length === 0 && (
                                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <Ticket size={24} className="text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400 font-medium">Números em processamento...</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-100 text-center">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                <CheckCircle2 size={14} /> Participação Confirmada
                            </div>
                            <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                                Guarde este comprovante.<br/>O sorteio será realizado via Instagram.
                            </p>
                        </div>
                    </div>
                    
                    {/* Receipt Footer Cut Effect */}
                    <div className="h-2 bg-slate-50 w-full flex overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-8 h-8 bg-white rotate-45 -translate-y-4 border border-slate-50"></div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid gap-3 no-print">
                    <button 
                        className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg" 
                        onClick={handlePrint}
                    >
                        <Printer size={20} />
                        Salvar como PDF / Imprimir
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            className="btn-secondary flex items-center justify-center gap-2" 
                            onClick={() => {
                                route('/');
                            }}
                        >
                            <HomeIcon size={18} />
                            Voltar ao Início
                        </button>
                        <a 
                            href="https://wa.me/5511999999999" 
                            target="_blank"
                            className="btn-secondary flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={18} />
                            Suporte
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center no-print">
                    <p className="text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                        <PartyPopper size={14} className="text-blue-400" /> Boa sorte no sorteio!
                    </p>
                </div>
            </div>

            {/* Playful Alert Modal */}
            {modal === 'playful' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
                    <div className="modern-card w-full max-w-xs p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{playfulContent.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            {playfulContent.message}
                        </p>
                        <button className="btn-primary w-full" onClick={() => setModal(null)}>
                            OK, Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
