export function Contract({ onClose }) {
    return (
        <div className="p-4 md:p-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center border-b border-slate-200 pb-4">
                    Contrato Digital de Participação
                </h2>
                
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed text-justify">
                    <p className="font-medium text-slate-800">
                        Este Contrato Digital de Participação em Rifa do Ivan é celebrado entre Ivan Pavin Cilento 46.118.941/0001-25 e o participante da rifa.
                    </p>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">1. Descrição do Serviço</h5>
                        <p>1.1. O Organizador conduzirá uma rifa online, na qual os Participantes poderão adquirir números para concorrer a prêmios especificados.</p>
                    </section>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">2. Condições de Participação</h5>
                        <p>2.1. Os Participantes devem ser maiores de idade, conforme as leis do seu país de residência.</p>
                        <p>2.2. Os Participantes devem adquirir um ou mais números de rifa conforme as regras estabelecidas pelo Organizador.</p>
                    </section>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">3. Prazo e Meta do Sorteio</h5>
                        <p>3.1. O sorteio ocorrerá após a meta de 52 bilhetes ser atingida, respeitando o prazo mínimo de arrecadação de 45 dias.</p>
                        <p>3.2. Caso a meta de 52 bilhetes seja atingida antes do prazo de 45 dias, a rifa permanecerá aberta para novas participações até o encerramento do período de 45 dias, visando aumentar o montante arrecadado e o valor do prêmio final.</p>
                        <p>3.3. Se ao final dos 45 dias a meta de 52 bilhetes não tiver sido alcançada, o Organizador poderá, a seu critério, realizar o sorteio com o montante atual ou estender o prazo até que a meta seja estabelecida.</p>
                    </section>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">4. Cancelamento do Sorteio</h5>
                        <p>4.1. O Organizador se reserva o direito de cancelar o sorteio por motivos justificáveis, incluindo, mas não se limitando a incapacidade de atingir um número mínimo de participantes no prazo estipulado.</p>
                    </section>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">5. Devolução do Dinheiro</h5>
                        <p>4.1. No caso de cancelamento do sorteio, o Organizador se compromete a reembolsar integralmente todos os Participantes através do mesmo método de pagamento utilizado.</p>
                    </section>

                    <section>
                        <h5 className="font-bold text-slate-900 mb-2">6. Proteção de Dados</h5>
                        <p>5.1. O Organizador concorda em proteger e manter confidenciais todas as informações pessoais fornecidas pelos Participantes.</p>
                    </section>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                        Rifa do Ivan • v1.2 Modern
                    </p>
                </div>
            </div>
            
            <div className="mt-6 flex justify-center">
                <button className="btn-primary w-full max-w-[200px]" onClick={onClose}>
                    Aceito e Fechar
                </button>
            </div>
        </div>
    );
}
