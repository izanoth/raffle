export function Rules({ onClose }) {
    return (
        <div style={{ padding: '10px' }}>
            <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #919b9c',
                padding: '15px', 
                fontSize: '12px', 
                lineHeight: '1.4',
                maxHeight: '400px',
                overflowY: 'auto',
                borderRadius: '5px'
            }}>
                <h2 style={{ fontSize: '14px', textDecoration: 'underline', marginTop: 0, textAlign: 'center' }}>
                    REGRAS DO SORTEIO
                </h2>
                
                <p><strong>1. Regras gerais do sorteio</strong></p>
                <p>1.1 Para concorrer ao sorteio o sr(a). deverá fazer a adesão de pelo menos um bilhete.</p>
                <p>1.2 Cada bilhete tem o preço de R$ 5,00 e lhe conferirá o direito de concorrer ao sorteio.</p>
                <p>1.3 Você pode comprar quantos bilhetes quiser, aumentando suas chances de ganhar.</p>
                <p>1.4 O sorteio não possui data fixa. O sorteio será realizado assim que a meta mínima de 500 (quinhentos) bilhetes vendidos for alcançada.</p>

                <p><strong>2. Do pagamento</strong></p>
                <p>2.1 O pagamento poderá ser feito via PIX ou presencialmente após o envio do formulário.</p>
                <p>2.2 Em caso de pagamento presencial, o sr(a). deverá entrar em contato com o organizador para validar sua participação.</p>

                <p><strong>3. Da efetivação</strong></p>
                <p>3.1 Uma vez o pagamento efetuado, o sr(a). receberá o comprovante da sua participação, contendo os números com os quais concorrerá.</p>

                <p><strong>4. Do prêmio</strong></p>
                <p>4.1 O prêmio será correspondente a 50% (cinquenta por cento) do valor total arrecadado com a venda dos bilhetes.</p>
                <p>4.2 O vencedor será contactado por meio do número de telefone para confirmar a transferência do prêmio via PIX.</p>
                
                <div style={{ marginTop: '20px', fontSize: '10px', textAlign: 'center', color: '#808080' }}>
                    Rifa do Ivan - Sistema de Ajuda v1.1
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <button class="btn" onClick={onClose} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
            </div>
        </div>
    );
}
