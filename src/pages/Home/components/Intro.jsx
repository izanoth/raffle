import { useState, useEffect } from 'preact/hooks';

export function Intro({ onClose }) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
            <div style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                fontFamily: 'monospace' 
            }}>
                Loading{dots}
            </div>
            <button class="btn" onClick={onClose} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
        </div>
    );
}
