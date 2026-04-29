import { ScrollText, Trophy, Wallet, CheckCircle } from 'lucide-preact';

export function Rules({ onClose }) {
    const rules = [
        {
            icon: <ScrollText size={20} className="text-blue-500" />,
            title: "Regras Gerais",
            text: "Cada bilhete custa R$ 5,00. O sorteio ocorre ao atingir a meta de 52 bilhetes."
        },
        {
            icon: <Wallet size={20} className="text-emerald-500" />,
            title: "Pagamento",
            text: "Aceitamos PIX automático para sua maior comodidade e segurança."
        },
        {
            icon: <CheckCircle size={20} className="text-purple-500" />,
            title: "Efetivação",
            text: "Após o pagamento, você recebe um comprovante digital com seus números."
        },
        {
            icon: <Trophy size={20} className="text-amber-500" />,
            title: "Prêmio",
            text: "O vencedor recebe 50% do valor total arrecadado diretamente via PIX."
        }
    ];

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white rounded-2xl p-2">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
                    Regras do Sorteio
                </h2>
                
                <div className="grid gap-4">
                    {rules.map((rule, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                {rule.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{rule.title}</h4>
                                <p className="text-slate-600 text-xs leading-relaxed">{rule.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                        Sorteio Transparente e Seguro
                    </p>
                </div>
            </div>
            
            <div className="mt-6 flex justify-center">
                <button className="btn-primary w-full max-w-[200px]" onClick={onClose}>
                    Entendido
                </button>
            </div>
        </div>
    );
}
