import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { 
    ArrowLeft, 
    Search, 
    CheckCircle2, 
    Clock, 
    User,
    RefreshCw,
    Download,
    Hash,
    MessageCircle
} from 'lucide-preact';
import '@styles';

export function List() {
    const { route } = useLocation();
    const [clients, setClients] = useState([]);
    const [filter, setFilter] = useState('');
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/admin/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setSyncing(false);
        }
    };

    const handleExportCSV = () => {
        window.open('/api/admin/clients/export', '_blank');
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
                        <button 
                            onClick={handleExportCSV}
                            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Download size={18} /> Exportar CSV
                        </button>
                        <button 
                            onClick={fetchClients}
                            disabled={syncing}
                            className="bg-blue-600 px-4 py-2.5 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} /> 
                            {syncing ? 'Sincronizando...' : 'Sincronizar'}
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participante</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bilhetes</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rifa ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{client.name}</span>
                                                <span className="text-xs text-slate-400">{client.email}</span>
                                                <span className="text-[10px] font-mono text-slate-400">#{client.id.toString().padStart(5, '0')} • {new Date(client.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-slate-600 text-xs">
                                                {client.units}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-xs text-blue-600 font-bold">
                                            {client.raffleId ? `#${client.raffleId}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-slate-900 whitespace-nowrap">
                                            R$ {client.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {client.paid ? (
                                                <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                                                    <CheckCircle2 size={18} />
                                                    <span className="font-bold text-[10px] uppercase tracking-wider">Pago</span>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="flex items-center justify-center gap-1.5 text-amber-500 cursor-pointer group"
                                                    onClick={() => handleConfirmPayment(client.id)}
                                                    title="Clique para confirmar pagamento"
                                                >
                                                    <Clock size={18} className="group-hover:scale-110 transition-transform" />
                                                    <span className="font-bold text-[10px] uppercase tracking-wider group-hover:underline">Pendente</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <a 
                                                href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} 
                                                target="_blank" 
                                                className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200 inline-flex"
                                                title="Falar no WhatsApp"
                                            >
                                                <MessageCircle size={16} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {filteredClients.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                            Nenhum participante encontrado.
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
