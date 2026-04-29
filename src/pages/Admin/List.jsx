import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    ArrowLeft, 
    Search, 
    CheckCircle2, 
    Clock, 
    CreditCard, 
    User,
    RefreshCw,
    Download
} from 'lucide-preact';
import '@styles';

export function List() {
    const { route } = useLocation();
    const [clients, setClients] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/admin/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleConfirmPayment = async (id) => {
        if (!confirm('Deseja confirmar o pagamento manual deste cliente?')) return;
        
        try {
            const response = await fetch(`/api/admin/clients/${id}/confirm-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                fetchClients();
            } else {
                alert('Erro ao confirmar pagamento.');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || 
        c.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button 
                            onClick={() => route('/admin/panel')}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-2"
                        >
                            <ArrowLeft size={18} />
                            Voltar ao Painel
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lista de Clientes</h1>
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                            <Download size={18} /> Exportar CSV
                        </button>
                        <button 
                            onClick={fetchClients}
                            className="bg-blue-600 px-4 py-2.5 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Sincronizar
                        </button>
                    </div>
                </div>

                <div className="modern-card">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar por nome ou e-mail..."
                                className="input-field pl-12"
                                value={filter}
                                onInput={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm font-bold whitespace-nowrap">
                            <User size={16} /> {filteredClients.length} Participantes
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Data</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participante</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Método</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-slate-400">#{client.id.toString().padStart(5, '0')}</p>
                                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{new Date(client.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{client.name}</p>
                                            <p className="text-xs text-slate-400">{client.email} • {client.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-slate-900">
                                            R$ {client.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {client.paid ? (
                                                <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                                                    <CheckCircle2 size={16} />
                                                    <span className="font-bold text-xs uppercase tracking-wider">Pago</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 text-amber-500">
                                                    <Clock size={16} />
                                                    <span className="font-bold text-xs uppercase tracking-wider">Aguardando PIX</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredClients.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                                            Nenhum cliente encontrado para os critérios de busca.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
