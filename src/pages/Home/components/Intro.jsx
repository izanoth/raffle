import { Bike, MessageCircle, ChevronRight } from 'lucide-preact';

export function Intro({ onClose }) {
    return (
        <div className="flex flex-col max-h-[80vh]">
            <div className="flex-grow overflow-y-auto px-6 py-8 custom-scrollbar">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        Olá! 👋
                    </h3>
                </div>
                
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                    <p>
                        Se você chegou até aqui, provavelmente fui eu quem fez sua entrega <Bike size={18} className="inline-block text-red-500 mx-1" />
                    </p>
                    <p>
                        Meu nome é <strong>Ivan</strong> — trabalho com delivery e também desenvolvo sistemas. Criei essa rifa como uma forma de gerar uma renda extra enquanto sigo focado nos estudos e nos meus projetos.
                    </p>
                    <p>
                        A proposta é simples: você participa com um valor acessível via PIX e concorre ao prêmio desta rifa. Todo o processo é organizado, com confirmação automática do pagamento e acompanhamento dos números.
                    </p>
                    <p>
                        Se fizer sentido pra você, fique à vontade para participar.
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualquer dúvida, pode me chamar:</p>
                            <p className="font-bold text-slate-900">(13) 98180-9361</p>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                        Obrigado pela atenção 🙏
                    </p>
                </div>
            </div>

            {/* Sticky Action Button Area */}
            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <button 
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2" 
                    onClick={onClose}
                >
                    Entrar e Participar
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
