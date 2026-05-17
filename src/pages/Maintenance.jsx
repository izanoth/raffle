import { useState } from 'preact/hooks';
import { Settings, MessageCircle, X, Clock, ShieldAlert } from 'lucide-preact';
import { ContactModal } from './Home/components/ContactModal';
import '@styles';

export function Maintenance() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-xl w-full text-center relative z-10 space-y-8 animate-fade-in">
                <div className="relative inline-block">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-2xl border-4 border-slate-800 flex items-center justify-center overflow-hidden mx-auto group hover:rotate-3 transition-transform duration-500">
                        <img src="/img/rifadoivan.png" alt="Rifa do Ivan" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-amber-500 p-3 rounded-2xl shadow-xl animate-bounce">
                        <Settings size={24} className="text-slate-900 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Estou em <span className="text-amber-500">Manutenção</span></h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                        Opa! Estou fazendo uns ajustes por aqui para deixar tudo certo. Em instantes o sistema estará de volta com força total!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 text-left">
                        <Clock className="text-blue-400 mb-3" size={24} />
                        <h3 className="font-bold text-slate-200">Previsão</h3>
                        <p className="text-sm text-slate-500">Tô trabalhando o mais rápido que posso pra gente voltar logo.</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 text-left">
                        <ShieldAlert className="text-amber-400 mb-3" size={24} />
                        <h3 className="font-bold text-slate-200">Segurança</h3>
                        <p className="text-sm text-slate-500">Fica tranquilo, seus dados e participações continuam seguros comigo.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button 
                        onClick={() => setIsContactOpen(true)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-black py-4 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        Fale Comigo
                    </button>
                </div>

                <div className="pt-12 border-t border-slate-800/50">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Rifa do Ivan &copy; 2026 • Codando o Futuro</p>
                </div>
            </div>

            {/* Modal de Contato */}
            {isContactOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="modern-card w-full max-w-2xl max-h-[90vh] flex flex-col bg-white">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-slate-500">
                                Contato
                            </span>
                            <button 
                                onClick={() => setIsContactOpen(false)} 
                                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <ContactModal onClose={() => setIsContactOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
