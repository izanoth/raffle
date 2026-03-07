import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function Panel() {
    const { route } = useLocation();
    const [stats, setStats] = useState({
        registers: 0,
        payments: 0,
        asaasIntents: 0,
        totalIntents: 0
    });

    useEffect(() => {
        if (!sessionStorage.getItem('admin')) {
            route('/admin');
            return;
        }
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin');
        route('/admin');
    };

    return (
        <div class="admin-panel container mt-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Status Panel</h2>
                <button class="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            
            <div class="stats-table">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th colspan="2" class="table-light text-dark"><h2>General Status</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Registers</td>
                            <td class="text-end">{stats.registers}</td>
                        </tr>
                        <tr>
                            <td>Payments</td>
                            <td class="text-end">{stats.payments}</td>
                        </tr>
                        <tr>
                            <th colspan="2" class="text-center table-light text-dark">PIX Intents</th>
                        </tr>
                        <tr>
                            <td>Asaas PIX</td>
                            <td class="text-end">{stats.asaasIntents}</td>
                        </tr>
                        <tr>
                            <th class="table-info text-dark">Total PIX Intents</th>
                            <td class="text-end">{stats.totalIntents}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex gap-3 mt-4">
                <button class="btn btn-primary" onClick={() => route('/admin/hasher')}>Hash Generator</button>
                <button class="btn btn-primary" onClick={() => route('/admin/list')}>Reinvite List</button>
                <button class="btn btn-primary">Telescope (Placeholder)</button>
            </div>
        </div>
    );
}
