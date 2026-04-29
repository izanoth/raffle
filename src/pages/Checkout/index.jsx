import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    CreditCard, 
    QrCode, 
    ArrowLeft, 
    Copy, 
    CheckCircle2, 
    AlertCircle,
    X,
    ShieldCheck,
    Loader2
} from 'lucide-preact';
import '@styles';

export function Checkout() {
    const { route } = useLocation();
    const [client, setClient] = useState(null);
    const [showPix, setShowPix] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [playfulContent, setPlayfulContent] = useState({ title: '', message: '' });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedClient = sessionStorage.getItem('new-client');
            if (!storedClient) {
                route('/');
                return;
            }
            setClient(JSON.parse(storedClient));
        }
    }, []);

    const handleSystemControl = (type) => {
        const contents = {
            close: {
                title: 'Transação Segura',
                message: 'Atenção! Uma transação está em curso. Fechar agora pode interromper o registro da sua participação. Conclua o processo para garantir seu lugar no sorteio.'
            },
            minimize: {
                title: 'Foco no Pagamento',
                message: 'O sistema recomenda manter esta janela ativa para processamento prioritário da sua sorte.'
            },
            maximize: {
                title: 'Interface Otimizada',
                message: 'O checkout já está na escala ideal para segurança e clareza. Não é necessário ampliar.'
            }
        };
        setPlayfulContent(contents[type]);
        setModal('playful');
    };

    const handlePixPayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/asaas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: client.id,
                    name: client.name,
                    phone: client.phone,
                    amount: client.amount
                })
            });
            const data = await response.json();
            if (data.success) {
                setPixData(data);
                setShowPix(true);
                startPolling();
            } else {
                alert('Erro na geração do pagamento: ' + data.error);
            }
        } catch (error) {
            alert('Erro de conexão ao servidor.');
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/asaas/polling?id=${client.id}`);
                const data = await response.json();
                if (data.confirmed) {
                    clearInterval(interval);
                    route('/success');
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 2000); 
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixData.payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!client) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-full max-w-lg">
                <button 
                    onClick={() => route('/')}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar e alterar dados
                </button>

                <div className="modern-card">
                    <div className="bg-slate-900 text-white px-8 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={16} className="text-blue-400" />
                                Checkout Seguro
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => handleSystemControl('close')} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Valor a Pagar</p>
                            <h2 className="text-4xl font-black">R$ {client.amount.toFixed(2)}</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Resumo do Pedido</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Participante</span>
                                    <span className="text-slate-900 font-bold text-sm">{client.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">ID da Transação</span>
                                    <span className="text-slate-900 font-mono text-xs">#{client.id.toString().padStart(6, '0')}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-slate-900 font-bold text-sm flex items-center gap-1.5">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        Garantia de Sorte
                                    </span>
                                    <span className="text-emerald-600 font-black text-sm">Ativa</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-center text-sm text-slate-500 font-medium mb-2">Conclua seu pagamento para garantir os bilhetes:</p>
                            
                            <button 
                                onClick={handlePixPayment}
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-emerald-500/20 group active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-2 rounded-xl">
                                        <QrCode size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-lg leading-none">Pagar com PIX</p>
                                        <p className="text-xs text-emerald-100 mt-1">Liberação instantânea dos bilhetes</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                    <ShieldCheck size={14} /> Pagamento processado com segurança por Asaas
                </p>
            </div>

            {/* PIX Modal */}
            {showPix && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
                    <div className="modern-card w-full max-w-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <QrCode size={16} className="text-emerald-500" />
                                Pagamento PIX
                            </span>
                            <button onClick={() => setShowPix(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 text-center">
                            <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm inline-block mb-6">
                                <img src={`data:image/png;base64,${pixData.qrcode}`} width="220" height="220" alt="QR Code" className="rounded-xl" />
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    Escaneie o código com o app do seu banco ou copie a chave abaixo:
                                </p>
                                
                                <button 
                                    onClick={copyToClipboard}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${
                                        copied 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-400'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            Copiar Código PIX
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                                    <Loader2 className="animate-spin text-blue-500" size={16} />
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        Aguardando confirmação...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Playful Alert Modal */}
            {modal === 'playful' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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

function ChevronRight({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}
