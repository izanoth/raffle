import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function List() {
    const { route } = useLocation();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (!sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/admin/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin');
        route('/admin');
    };

    return (
        <div class="admin-list container mt-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Reinvite List</h2>
                <div>
                    <button class="btn btn-secondary me-2" onClick={() => route('/admin/panel')}>Voltar</button>
                    <button class="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Created at</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>CPF</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.created_at}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.cpf}</td>
                                <td>{client.asaas_id ? 'PIX' : 'None'}</td>
                                <td>R$ {client.amount},00</td>
                                <td style={{ color: client.paid ? 'green' : 'orange' }}>
                                    {client.paid ? 'Yes' : 'Developing'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
