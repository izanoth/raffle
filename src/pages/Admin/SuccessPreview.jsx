import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import '@styles';

export function SuccessPreview() {
    const { route } = useLocation();
    const [showPreview, setShowPreview] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        date: new Date().toLocaleDateString('pt-BR'),
        tickets: "",
        payInPerson: false,
        raffleId: "000000001",
        orderId: "001"
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        // Pega a data informada no formulário (DD/MM/AAAA ou DD/MM/AA) e limpa para DDMMAA
        const cleanDate = formData.date.replace(/\//g, '');
        const dateStr = cleanDate.length > 6 ? cleanDate.substring(0, 4) + cleanDate.substring(6, 8) : cleanDate;
        
        const orderNo = formData.orderId.padStart(3, '0');
        document.title = `rifa-do-ivan_pedido-no${orderNo}_${dateStr}`;
        window.print();
        document.title = originalTitle;
    };

    const bilhetes = formData.tickets.split(',').map(t => t.trim()).filter(t => t !== "");

    if (showPreview) {
        return (
            <div class="window success" style={{ maxWidth: '450px', margin: '20px auto' }}>
                <div class="title-bar no-print">
                    <div class="title-bar-text">Comprovante Gerado (ADMIN)</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" onClick={() => setShowPreview(false)}>×</button>
                    </div>
                </div>

                <div class="window-body">
                    <div class="fieldset" style={{ border: '2px dashed #000080', marginBottom: '10px' }}>
                        <p style={{ margin: '0', fontSize: '11px', color: '#000080', textAlign: 'center' }}>
                            <b>Este comprovante foi gerado administrativamente.</b>
                        </p>
                    </div>

                    <div id="receipt-content" class="inner tokbg" style={{ paddingBottom: '10px', textAlign: 'center', marginBottom: '10px', borderRadius: '30px', color: 'white' }}>
                        <table style={{ color: '#000', fontWeight: '900', width: '100%', position: 'relative', textAlign: 'center' }}>
                            <tbody>
                                <tr>
                                    <td style={{ fontSize: '12px' }}>Nome: {formData.name || '---'} </td>
                                    <td style={{ fontSize: '12px' }}>Data: {formData.date}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontSize: '12px' }}>Pedido: No {formData.orderId}</td>
                                    <td style={{ fontSize: '12px' }}>Sorteio: {formData.raffleId}</td>
                                </tr>
                                {bilhetes.length > 0 ? bilhetes.map((item) => (
                                    <tr key={item}>
                                        <td colspan="2" style={{ textAlign: 'center', fontSize: '32px', textShadow: '1px 1px 2px dark' }}>
                                            <p class="mask">{item}</p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colspan="2" style={{padding: '20px', color: '#000'}}>Nenhum bilhete inserido</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {formData.payInPerson && (
                        <div class="fieldset" style={{ border: '1px solid #cc3000', marginBottom: '10px' }}>
                            <p style={{ margin: '0', fontSize: '11px', color: '#cc3000', fontWeight: 'bold' }}>
                                Nota: Como você optou por pagar pessoalmente, lembre-se de que os bilhetes porderão ser cancelados. Agradeço a sua compreensão!
                            </p>
                        </div>
                    )}

                    <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', gap: '10px' }} class="no-print">
                        <button class="btn" style={{ flex: 1 }} onClick={() => setShowPreview(false)}>Editar Dados</button>
                        <button class="btn" style={{ flex: 1 }} onClick={handlePrint}>Imprimir / PDF</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div class="window" style={{ maxWidth: '400px', margin: '20px auto' }}>
            <div class="title-bar">
                <div class="title-bar-text">Gerar Comprovante Manual</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" onClick={() => route('/admin/panel')}>×</button>
                </div>
            </div>
            <div class="window-body">
                <p>Insira os dados para gerar o layout do comprovante:</p>
                
                <div class="field-row-stacked" style={{ marginBottom: '10px' }}>
                    <label>Nome do Cliente:</label>
                    <input name="name" type="text" value={formData.name} onInput={handleInputChange} style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div class="field-row-stacked" style={{ flex: 1 }}>
                        <label>Pedido No:</label>
                        <input name="orderId" type="text" value={formData.orderId} onInput={handleInputChange} style={{ width: '100%' }} />
                    </div>
                    <div class="field-row-stacked" style={{ flex: 1 }}>
                        <label>Sorteio:</label>
                        <input name="raffleId" type="text" value={formData.raffleId} onInput={handleInputChange} style={{ width: '100%' }} />
                    </div>
                </div>

                <div class="field-row-stacked" style={{ marginBottom: '10px' }}>
                    <label>Data (DD/MM/AAAA):</label>
                    <input name="date" type="text" value={formData.date} onInput={handleInputChange} style={{ width: '100%' }} />
                </div>

                <div class="field-row-stacked" style={{ marginBottom: '10px' }}>
                    <label>Bilhetes (separe por vírgula):</label>
                    <input name="tickets" type="text" placeholder="1234, 5678" value={formData.tickets} onInput={handleInputChange} style={{ width: '100%' }} />
                </div>

                <div class="field-row" style={{ marginBottom: '20px' }}>
                    <input id="pay-person" name="payInPerson" type="checkbox" checked={formData.payInPerson} onChange={handleInputChange} />
                    <label for="pay-person">Pagamento Presencial / Pendente</label>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button class="btn" style={{ flex: 1 }} onClick={() => setShowPreview(true)}>Visualizar Comprovante</button>
                    <button class="btn" style={{ flex: 1 }} onClick={() => route('/admin/panel')}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
