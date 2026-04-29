import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Lock, User, ShieldAlert, ChevronRight, Loader2 } from 'lucide-preact';
import '@styles';

export function Login() {
    const { route } = useLocation();
    const [admin, setAdmin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: admin, password })
            });
            const data = await response.json();
            if (response.ok) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('admin', data.user);
                }
                route('/admin/panel');
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Painel Admin</h1>
                    <p className="text-slate-400 mt-2 font-medium">Acesso restrito ao organizador</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuário</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3.5 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                    type="text" 
                                    placeholder="Nome de usuário"
                                    value={admin} 
                                    onInput={(e) => setAdmin(e.target.value)} 
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3.5 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onInput={(e) => setPassword(e.target.value)} 
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm font-medium animate-fade-in">
                                <ShieldAlert size={18} />
                                Credenciais inválidas ou acesso negado.
                            </div>
                        )}

                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Acessar Painel
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <button 
                    onClick={() => route('/')}
                    className="mt-8 w-full text-slate-500 hover:text-slate-300 text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                    Voltar para a Rifa
                </button>
            </div>
        </div>
    );
}
