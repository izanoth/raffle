import { useLocation } from 'preact-iso';
import { 
    LayoutDashboard, 
    Users, 
    Hash, 
    LogOut,
    Menu,
    X,
    Ticket
} from 'lucide-preact';
import { useState } from 'preact/hooks';

export function Header() {
    const { url, route } = useLocation();
    const isAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('admin') : null;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('admin');
        }
        route('/admin');
    };

    if (!isAdmin) return null;

    const navItems = [
        { label: 'Painel', path: '/admin/panel', icon: <LayoutDashboard size={18} /> },
        { label: 'Clientes', path: '/admin/list', icon: <Users size={18} /> },
        { label: 'Hasher', path: '/admin/hasher', icon: <Hash size={18} /> },
    ];

    return (
        <header className="bg-slate-900 text-white sticky top-0 z-[100] no-print">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Ticket size={20} className="text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tight">Rifa Admin</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map(item => (
                        <button 
                            key={item.path}
                            onClick={() => route(item.path)}
                            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                                url === item.path ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                    <div className="w-px h-6 bg-slate-800 ml-2"></div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-slate-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-800 border-t border-slate-700 animate-fade-in">
                    <div className="p-4 space-y-4">
                        {navItems.map(item => (
                            <button 
                                key={item.path}
                                onClick={() => {
                                    route(item.path);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${
                                    url === item.path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-red-400 hover:bg-red-950/30 transition-colors"
                        >
                            <LogOut size={18} />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
