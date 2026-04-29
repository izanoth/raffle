import { AlertCircle } from 'lucide-preact';

export function Playful({ content, onClose }) {
    return (
        <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{content.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {content.message}
                    </p>
                </div>
            </div>
            <button className="btn-primary w-full" onClick={onClose}>
                Entendido
            </button>
        </div>
    );
}
