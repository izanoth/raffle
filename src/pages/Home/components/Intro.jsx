import { useState, useEffect } from 'preact/hooks';

export function Intro({ onClose }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % 8);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const blocks = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const radius = 20; // Slightly smaller radius for a more compact feel
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const diff = (i - step + 8) % 8;
        let opacity = 0.1;
        if (diff === 0) opacity = 1.0;
        else if (diff === 7) opacity = 0.6;
        else if (diff === 6) opacity = 0.3;

        return (
            <div 
                key={i}
                style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#000080',
                    left: `calc(50% + ${x}px - 3px)`,
                    top: `calc(50% + ${y}px - 3px)`,
                    opacity: opacity,
                    border: '1px solid #000',
                }}
            />
        );
    });

    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--win-gray)'
        }}>
            <div style={{ 
                position: 'relative', 
                width: '60px', 
                height: '60px',
                marginBottom: '15px',
                border: '2px inset #fff',
                backgroundColor: '#c0c0c0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {blocks}
            </div>
            
            <div style={{ 
                fontSize: '11px', 
                fontWeight: 'bold',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                color: '#000',
                marginBottom: '20px'
            }}>
                Pensando...
            </div>

            <div>
                <button class="btn" onClick={onClose} style={{ width: '80px' }}>OK</button>
            </div>
        </div>
    );
}
