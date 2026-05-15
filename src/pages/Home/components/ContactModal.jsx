import { useState } from 'preact/hooks';
import { Send, User, Mail, MessageSquare, Tag, CheckCircle2, AlertCircle } from 'lucide-preact';

export function ContactModal({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setError(data.error || 'Falha ao enviar mensagem.');
            }
        } catch (err) {
            setStatus('error');
            setError('Erro de conexão com o servidor.');
        }
    };

    if (status === 'success') {
        return (
            <div className="p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Mensagem Enviada!</h3>
                <p className="text-slate-600 text-sm mb-8">
                    Obrigado pelo contato. Responderei o mais breve possível no e-mail informado.
                </p>
                <button 
                    onClick={onClose}
                    className="btn-primary w-full py-4 rounded-2xl"
                >
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Contato</h2>
                <p className="text-slate-500 text-sm text-center mt-2">
                    Dúvidas, sugestões ou suporte? Mande uma mensagem.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label-text">Nome</label>
                    <div className="relative flex items-center">
                        <User size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                        <input
                            className="input-field"
                            type="text"
                            name="name"
                            placeholder="Seu nome"
                            value={formData.name}
                            onInput={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label-text">E-mail</label>
                    <div className="relative flex items-center">
                        <Mail size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                        <input
                            className="input-field"
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onInput={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label-text">Assunto (Opcional)</label>
                    <div className="relative flex items-center">
                        <Tag size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
                        <input
                            className="input-field"
                            type="text"
                            name="subject"
                            placeholder="Sobre o que quer falar?"
                            value={formData.subject}
                            onInput={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="label-text">Mensagem</label>
                    <div className="relative">
                        <MessageSquare size={18} className="absolute left-4 top-4 text-slate-400 pointer-events-none z-10" />
                        <textarea
                            className="input-field min-h-[120px] pt-3 px-11"
                            name="message"
                            placeholder="Sua mensagem aqui..."
                            value={formData.message}
                            onInput={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <button 
                    className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 mt-4" 
                    type="submit" 
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
