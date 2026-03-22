export function Contract({ onClose }) {
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
                    Contrato Digital de Participação
                </h2>
                
                <p>Este Contrato Digital de Participação em Rifa do Ivan é celebrado entre Zanoth Tecnologia 46.118.941/0001-25 e o participante da rifa.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>1. Descrição do Serviço</h5>
                <p>1.1. O Organizador conduzirá uma rifa online, na qual os Participantes poderão adquirir números para concorrer a prêmios especificados.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>2. Condições de Participação</h5>
                <p>Os Participantes concordam em cumprir as seguintes condições:</p>
                <p>2.1. Os Participantes devem ser maiores de idade, conforme as leis do seu país de residência.</p>
                <p>2.2. Os Participantes devem adquirir um ou mais números de rifa conforme as regras estabelecidas pelo Organizador.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>3. Cancelamento do Sorteio</h5>
                <p>O Organizador se reserva o direito de cancelar o sorteio por motivos justificáveis, incluindo, mas não se limitando a:</p>
                <p>3.1. Incapacidade de atingir um número mínimo de participantes.</p>
                <p>3.2. Circunstâncias imprevistas, como desastres naturais, emergências de saúde pública ou outras situações fora do controle do Organizador.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>4. Devolução do Dinheiro</h5>
                <p>4.1. No caso de cancelamento do sorteio, o Organizador se compromete a reembolsar integralmente todos os Participantes que adquiriram números de rifa. O reembolso será processado automaticamente através do mesmo método de pagamento utilizado pelo Participante para adquirir os números de rifa.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>5. Responsabilidades do Organizador</h5>
                <p>O Organizador se compromete a:</p>
                <p>5.1. Conduzir o sorteio de forma justiça e transparente.</p>
                <p>5.2 Garantir a segurança e confidencialidade das informações dos Participantes.</p>
                <p>5.3. Cumprir todas as leis e regulamentos aplicáveis relacionados à realização de rifas online.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>6. Responsabilidades dos Participantes</h5>
                <p>Os Participantes concordam em:</p>
                <p>6.1. Adquirir números de rifa de forma ética e respeitosa.</p>
                <p>6.2. Respeitar todas as regras e regulamentos estabelecidos pelo Organizador.</p>
                <p>6.3. Aceitar as decisões do Organizador como definitivas e vinculativas.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>7. Proteção de Dados</h5>
                <p>7.1. O Organizador concorda em proteger e manter confidenciais todas as informações pessoais fornecidas pelos Participantes durante o processo de participação na rifa. Essas informações serão utilizadas exclusivamente para os fins relacionados à rifa e não serão compartilhadas com terceiros sem consentimento prévio dos Participantes.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>8. Taxas de Transação e Arrecadação</h5>
                <p>8.1. O Participante está ciente de que as transações via PIX podem estar sujeitas a taxas de processamento impostas pela plataforma financeira intermediária (Asaas ou similar).</p>
                <p>8.2. Devido a essas possíveis taxas retidas na fonte por transação, o montante final arrecadado pelo Organizador pode não corresponder exatamente à soma bruta dos valores pagos pelos Participantes, sendo o valor líquido destinado ao propósito da rifa após as devidas deduções operacionais da plataforma.</p>

                <h5 style={{ fontSize: '13px', marginBottom: '5px', borderBottom: '1px solid #c0c0c0', paddingBottom: '2px' }}>9. Disposições Gerais</h5>
                <p>9.1. Este Contrato constitui o acordo integral entre o Organizador e os Participantes e substitui todos os acordos anteriores ou contemporâneos relacionados ao assunto aqui discutido.</p>
                <p>9.2. Ao clicar no botão "Aceito os termos do contrato digital" ou realizar qualquer ação indicando aceitação deste Contrato durante o processo de participação na rifa, o Participante concorda em cumprir os termos e condições deste Contrato.</p>
                <p>9.3. Este Contrato é válido e eficaz a partir da data em que o Participante realiza a sua participação na rifa.</p>
                
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
