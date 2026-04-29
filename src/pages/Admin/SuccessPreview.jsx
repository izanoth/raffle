import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    FileText, 
    ArrowLeft, 
    Eye, 
    Settings2, 
    Printer, 
    User, 
    Ticket, 
    Calendar,
    AlertCircle,
    X,
    CheckCircle2
} from 'lucide-preact';
import '@styles';

export function SuccessPreview() {
    const { route } = useLocation();
    const [showPreview, setShowPreview] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        date: new Date().toLocaleDateString('pt-BR'),
        tickets: "",
        raffleId: "000000001",
        orderId: "001"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        const cleanDate = formData.date.replace(/\//g, '');
        const dateStr = cleanDate.length > 6 ? cleanDate.substring(0, 4) + cleanDate.substring(6, 8) : cleanDate;
        
        const orderNo = formData.orderId.padStart(3, '0');
        document.title = `rifa-do-ivan_pedido-no${orderNo}_${dateStr}`;
        window.print();
        document.title = originalTitle;
    };

    const bilhetes = formData.tickets.split(',').map(t => t.trim()).filter(t => t !== "");

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button 
                            onClick={() => route('/admin/panel')}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-2"
                        >
                            <ArrowLeft size={18} />
                            Voltar ao Painel
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Emissor de Comprovante</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Config Form */}
                    <div className="modern-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                                <Settings2 size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Configuração</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="label-text">Nome do Participante</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input name="name" className="input-field pl-11" type="text" value={formData.name} onInput={handleInputChange} placeholder="Ex: João Silva" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Pedido №</label>
                                    <input name="orderId" className="input-field" type="text" value={formData.orderId} onInput={handleInputChange} />
                                </div>
                                <div>
                                    <label className="label-text">Sorteio</label>
                                    <input name="raffleId" className="input-field" type="text" value={formData.raffleId} onInput={handleInputChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="label-text">Data</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input name="date" className="input-field pl-11" type="text" value={formData.date} onInput={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Bilhetes (vírgula para separar)</label>
                                <div className="relative">
                                    <Ticket className="absolute left-4 top-3 text-slate-400" size={18} />
                                    <textarea 
                                        name="tickets" 
                                        className="input-field pl-11 min-h-[100px] py-3" 
                                        placeholder="1234, 5678, 9012"
                                        value={formData.tickets} 
                                        onInput={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Eye size={16} /> Preview do Layout
                            </h3>
                            <button 
                                onClick={handlePrint}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                <Printer size={16} /> Gerar PDF
                            </button>
                        </div>

                        {/* Modern Receipt Rendering */}
                        <div className="modern-card relative overflow-hidden shadow-2xl">
                            <div className="receipt-pattern opacity-10"></div>
                            
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Admin Issue</p>
                                        <h2 className="text-2xl font-black">Rifa do Ivan</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold">{formData.date}</p>
                                        <p className="text-[10px] opacity-60">Pedido #{formData.orderId}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-60 font-black tracking-widest mb-1">Participante</p>
                                        <p className="font-bold text-sm">{formData.name || '---'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase opacity-60 font-black tracking-widest mb-1">Sorteio</p>
                                        <p className="font-bold text-sm">#{formData.raffleId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white relative">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {bilhetes.length > 0 ? bilhetes.map((item) => (
                                        <div key={item} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Ticket</p>
                                            <p className="text-xl font-black text-slate-900">{item}</p>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                            <p className="text-xs text-slate-400 font-medium">Nenhum bilhete definido</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t-2 border-dashed border-slate-100 text-center">
                                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                        <CheckCircle2 size={12} /> Emissão Administrativa
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-1.5 bg-slate-50 w-full flex overflow-hidden">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="flex-shrink-0 w-6 h-6 bg-white rotate-45 -translate-y-3 border border-slate-50"></div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 flex gap-3">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                <strong>Dica do Admin:</strong> Use este módulo para gerar layouts de comprovantes para conferência ou testes de impressão.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
