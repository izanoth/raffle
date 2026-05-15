import { Settings, Clock, ShieldAlert } from 'lucide-preact';
import '@styles';

export function Maintenance() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-xl w-full text-center relative z-10 space-y-8">
                <div className="inline-flex p-6 bg-slate-800 rounded-full border-4 border-amber-500 shadow-2xl shadow-amber-500/20 animate-bounce">
                    <Settings size={64} className="text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tight leading-tight">Estamos em Manutenção</h1>
                    <p className="text-slate-400 text-lg font-medium">Estamos aprimorando nossa plataforma para oferecer a melhor experiência possível. Voltaremos em breve!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 text-left">
                        <Clock className="text-blue-400 mb-3" size={24} />
                        <h3 className="font-bold text-slate-200">Previsão</h3>
                        <p className="text-sm text-slate-500">Estamos trabalhando rápido para voltar o quanto antes.</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 text-left">
                        <ShieldAlert className="text-amber-400 mb-3" size={24} />
                        <h3 className="font-bold text-slate-200">Segurança</h3>
                        <p className="text-sm text-slate-500">Seus dados e participações continuam seguros conosco.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Rifa do Ivan &copy; 2026</p>
                </div>
            </div>
        </div>
    );
}
