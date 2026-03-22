export function Playful({ content, onClose }) {
    return (
        <div style={{ padding: '10px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ 
                    width: '48px', height: '48px', background: '#e81123', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', 
                    fontSize: '32px', fontWeight: 'bold', flexShrink: 0 
                }}>!</div>
                <p style={{ textAlign: 'left', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
                    {content.message}
                </p>
            </div>
            <button class="btn" onClick={onClose} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
        </div>
    );
}
