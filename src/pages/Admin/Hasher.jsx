import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function Hasher() {
    const { route } = useLocation();
    const [password, setPassword] = useState('');
    const [hash, setHash] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('admin')) {
            route('/admin');
        }
    }, []);

    const handleGenerate = (e) => {
        e.preventDefault();
        // In a real app, use a bcrypt library. 
        // For now, this is a placeholder simulation.
        setHash(`$2y$10$hashed_${btoa(password).substring(0, 20)}`);
    };

    return (
        <div class="admin-hasher container mt-5 text-center">
            {hash && (
                <div class="alert alert-info">
                    <strong>Generated Hash:</strong> <br />
                    <code>{hash}</code>
                </div>
            )}

            <h2>BCrypt Hash Generator</h2>
            <form onSubmit={handleGenerate} class="bg-light p-4 border rounded">
                <div class="mb-3">
                    <label for="password">Password:</label>
                    <input 
                        id="password"
                        class="form-control" 
                        type="password" 
                        value={password} 
                        onInput={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button class="btn btn-dark" type="submit">Gerar</button>
            </form>
            <div class="mt-3">
                <button class="btn btn-link" onClick={() => route('/admin/panel')}>Voltar</button>
            </div>
        </div>
    );
}
