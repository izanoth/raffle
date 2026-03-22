export function Intro({ onClose }) {
    return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ marginBottom: '20px', border: '1px solid #919b9c', padding: '15px', backgroundColor: '#fff', textAlign: 'left', lineHeight: '1.6', borderRadius: '5px' }}>
                <p><strong>Olá!</strong></p>
                
                <p>Meu nome é <strong>Ivan</strong>. Sou estudante de Farmácia na Etec e, atualmente, faço meus deslocamentos a pé. Para facilitar minha locomoção diária — principalmente para estudar — estou realizando esta rifa com o objetivo de arrecadar o valor necessário para comprar uma bicicleta.</p>

                <p>Pensei na rifa como uma forma simples e justa de lidar com esse problema pontual, já que todos que participam também têm a chance de ganhar. O prêmio do sorteio será de 50% do valor total arrecadado.</p>

                <p>A contagem regressiva para o sorteio começará após a venda de um número mínimo de 100 bilhetes. A partir desse momento, será iniciada uma contagem de 30 dias até a realização do sorteio.</p>

                <p>Se puder participar, você estará contribuindo diretamente para que eu consiga continuar meus estudos com mais mobilidade. Obrigado pelo apoio e boa sorte! 🚲</p>									
            </div>
            <button class="btn" onClick={onClose} style={{ width: '100px', fontWeight: 'bold' }}>OK</button>
        </div>
    );
}
