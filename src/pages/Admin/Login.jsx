import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function Login() {
    const { route } = useLocation();
    const [admin, setAdmin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    return (
        <div class="admin-login d-flex flex-column justify-content-center align-items-center mt-5">
            <h2>Adm</h2>
            <form class="form-group p-4 bg-light border rounded" onSubmit={handleSubmit}>
                <div class="mb-3">
                    <label>Admin User</label>
                    <input 
                        class="form-control" 
                        type="text" 
                        value={admin} 
                        onInput={(e) => setAdmin(e.target.value)} 
                    />
                </div>
                <div class="mb-3">
                    <label>Password</label>
                    <input 
                        class="form-control" 
                        type="password" 
                        value={password} 
                        onInput={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button class="btn btn-dark w-100" type="submit">Acessar</button>
                {error && <div class="alert alert-danger mt-3">Credenciais inválidas.</div>}
            </form>
        </div>
    );
}
