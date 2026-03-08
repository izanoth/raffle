import { useLocation } from 'preact-iso';

export function Header() {
    const { url, route } = useLocation();
    const isAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('admin') : null;

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('admin');
        }
        route('/admin');
    };

    if (isAdmin) {
       return (
            <div class="window no-print" style={{ marginBottom: '10px' }}>
                <div class="title-bar">
                    <div class="title-bar-text">Menu Administrativo</div>
                </div>
                <div class="window-body" style={{ display: 'flex', gap: '5px', padding: '5px' }}>
                    <button class="btn" onClick={() => route('/admin/panel')}>Painel</button>
                    <button class="btn" onClick={() => route('/admin/list')}>Lista de Clientes</button>
                    <button class="btn" onClick={() => route('/admin/hasher')}>Gerador de Hash</button>
                    <button class="btn" style={{ marginLeft: 'auto' }} onClick={handleLogout}>Sair</button>
                </div>
            </div>
       );
    }

    // Para o frontend do usuário, não usaremos header para manter o estilo de janela única
    return null;
}
