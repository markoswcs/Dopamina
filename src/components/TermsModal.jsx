import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div 
 className="absolute inset-0 bg-black/80 backdrop-blur-sm"
 onClick={onClose}
 />
 
 <div className="relative bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col animate-[jumpIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
 
 {/* Header */}
 <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-950/50">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
 <ShieldCheck className="w-5 h-5 text-orange-500"/>
 </div>
 <div>
 <h2 className="text-xl font-black text-white uppercase tracking-wider">Termos de Uso</h2>
 <p className="text-sm font-bold text-zinc-500">Política de Entretenimento DopaShop</p>
 </div>
 </div>
 <button 
 onClick={onClose}
 className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
 >
 <X className="w-5 h-5"/>
 </button>
 </div>

 {/* Content */}
 <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-zinc-300 text-sm">
 
 <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
 <h3 className="font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
 <ShieldCheck className="w-4 h-4"/> Importante
 </h3>
 <p className="font-medium text-orange-200/80 leading-relaxed">
 O saldo depositado destina-se <strong>exclusivamente</strong> à compra de moeda virtual (Dopas) para uso em minigames e simulações de entretenimento dentro da plataforma DopaShop.
 </p>
 </div>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">1. NATUREZA DO SERVIÇO</h3>
 <p className="leading-relaxed text-zinc-400">
 A DopaShop é uma plataforma puramente recreativa e satírica. Todos os produtos listados como"físicos"(ex: RTX 5090, Gatos de Energia, Peças de Reposição) são itens virtuais imaginários. Nenhuma entrega física será realizada. O ato da compra simula uma experiência de e-commerce humorística.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">2. MOEDA VIRTUAL E SAQUES</h3>
 <p className="leading-relaxed text-zinc-400">
 As"Dopas"(DopaCoins) não possuem valor fiduciário fora do ambiente do site. 
 <strong> Não é possível realizar saques, transferências para contas bancárias ou converter as Dopas de volta para moeda Real (BRL).</strong> Todo o valor depositado caracteriza uma compra irreversível de bens digitais para entretenimento imediato.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">3. POLÍTICA DE ARREPENDIMENTO E REEMBOLSO</h3>
 <p className="leading-relaxed text-zinc-400">
 Por se tratar de um bem digital consumível imediatamente (moeda virtual depositada instantaneamente na conta do usuário), o direito de arrependimento (Art. 49 do CDC) caduca no momento em que a moeda é creditada e consumida (ex: utilizada em jogos como o Foguetinho ou abertura de caixas). Estornos só serão processados se a moeda não houver sido gasta.
 </p>
 </section>
 
 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">4. MECÂNICAS DE SORTEIO E ENTRETENIMENTO</h3>
 <p className="leading-relaxed text-zinc-400">
 Os resultados das mecânicas (Crash, Caixas) são gerados por algoritmos de aleatoriedade (RNG) puramente para fins lúdicos, sem envolver ganho financeiro ou premiações no mundo real.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">5. MAIORIDADE E CAPACIDADE CIVIL</h3>
 <p className="leading-relaxed text-zinc-400">
 A plataforma é estritamente proibida para menores de 18 anos. Ao aceitar os termos e realizar um depósito, o usuário atesta ter capacidade civil plena e ser o titular responsável pelos fundos utilizados.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">6. COMBATE A FRAUDES E USO DE SCRIPTS</h3>
 <p className="leading-relaxed text-zinc-400">
 É expressamente proibido o uso de bots, scripts, automações, ou a exploração de bugs (falhas no sistema) para obter vantagem no inventário ou nas batalhas. A DopaShop se reserva o direito de banir permanentemente a conta infratora, zerando o saldo de Dopas, sem direito a qualquer tipo de reembolso.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">7. ESTABILIDADE DO SERVIDOR E BUGS</h3>
 <p className="leading-relaxed text-zinc-400">
 A plataforma não se responsabiliza por perdas de saldo virtual (Dopas) decorrentes de oscilações na conexão de internet do próprio usuário ou manutenções imprevistas do servidor, sendo o log do sistema interno a prova definitiva de qualquer transação ou jogada.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">8. ATUALIZAÇÃO DOS TERMOS</h3>
 <p className="leading-relaxed text-zinc-400">
 A DopaShop reserva-se o direito de modificar, adicionar ou remover partes destes Termos de Uso a qualquer momento, sem aviso prévio. O uso contínuo da plataforma após as alterações constitui a aceitação imediata dos novos termos.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">9. PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)</h3>
 <p className="leading-relaxed text-zinc-400">
 Respeitamos a sua privacidade. Os dados pessoais e de pagamento coletados durante o cadastro e as transações são utilizados estritamente para o funcionamento da plataforma, verificação de segurança e processamento de pagamentos, não sendo comercializados ou compartilhados com terceiros para fins publicitários.
 </p>
 </section>

 <section className="flex flex-col gap-3">
 <h3 className="font-black text-white text-base">10. FORO DE ELEIÇÃO</h3>
 <p className="leading-relaxed text-zinc-400">
 Fica eleito o foro da comarca de São Paulo / SP para dirimir quaisquer dúvidas ou controvérsias oriundas da utilização da plataforma ou deste documento, renunciando a qualquer outro por mais privilegiado que seja.
 </p>
 </section>

 </div>

 {/* Footer */}
 <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex justify-end">
 <button 
 onClick={onClose}
 className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors active:scale-95"
 >
 Estou Ciente
 </button>
 </div>
 </div>
 </div>
 );
}
