import React from "react";

const messages = [
  "🚨 100% FAKE, 200% DOPAMINA",
  "💰 Preço final sempre 0,00 Dopas",
  "🤖 Entregue por pessoas quase reais",
  "📦 Rastreamento do seu produto que não chega",
  "⚡ Satisfação garantida ou seu dinheiro imaginário de volta",
  "🎯 Promoção que não existe em loja que não existe",
  "🔥 Compre agora e não pague nunca",
  "🛒 Frete calculado pelo tempo que você leva pra sonhar",
  "💎 Produtos testados por IA que não entende de qualidade",
  "🎁 Cupom de desconto em cima de nada"
];

export default function TopMarquee() {
  const doubled = [...messages, ...messages];

  return (
    <div className="w-full overflow-hidden theme-surface border-b theme-border select-none">
      <div className="animate-marquee flex whitespace-nowrap py-1.5">
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[11px] font-medium theme-text-secondary mx-6 shrink-0"
          >
            {msg}
            <span className="mx-6 text-accent opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
