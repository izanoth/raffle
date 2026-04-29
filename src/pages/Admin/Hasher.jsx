import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Hash, Key, Copy, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-preact';
import '@styles';

export function Hasher() {
    const { route } = useLocation();
    const [password, setPassword] = useState('');
    const [hash, setHash] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
        }
    }, []);

    const handleGenerate = (e) => {
        e.preventDefault();
        // Simulation of hash generation
        setHash(`$2y$10$hashed_${btoa(password).substring(0, 20)}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
            <div className="max-w-md mx-auto">
                <button 
                    onClick={() => route('/admin/panel')}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                    <ArrowLeft size={18} />
                    Voltar ao Painel
                </button>

                <div className="modern-card">
                    <div className="p-8">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <Hash size={32} />
                        </div>
                        
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Gerador de Hash</h1>
                        <p className="text-slate-500 text-sm mb-8">
                            Crie hashes BCrypt para configurar novos usuários administradores no sistema.
                        </p>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="label-text">Senha para Criptografar</label>
                                <div className="relative">
                                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        className="input-field pl-11"
                                        type="password" 
                                        placeholder="Digite a senha"
                                        value={password} 
                                        onInput={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button className="btn-primary w-full flex items-center justify-center gap-2" type="submit">
                                <ShieldCheck size={20} />
                                Gerar Hash BCrypt
                            </button>
                        </form>

                        {hash && (
                            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white animate-fade-in">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Hash Gerado</p>
                                <code className="block break-all font-mono text-blue-400 text-sm mb-4 leading-relaxed">
                                    {hash}
                                </code>
                                <button 
                                    onClick={copyToClipboard}
                                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                                        copied 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Copiado para o Clip!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            Copiar Hash
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
