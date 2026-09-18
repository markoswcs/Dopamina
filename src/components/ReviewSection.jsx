import React from "react";
import { Star, CheckCircle, ThumbsUp } from "lucide-react";

export default function ReviewSection({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="w-full theme-card border theme-border p-4 rounded-xl mt-4">
      <h3 className="font-display font-bold text-sm mb-3 theme-text border-b theme-border pb-2 flex items-center gap-2">
        <span>Opiniões dos Compradores</span>
        <span className="text-[10px] bg-success/10 text-success py-0.5 px-2 rounded-full font-semibold">
          ✓ Verificado
        </span>
      </h3>

      <div className="space-y-3">
        {reviews.map((review, index) => (
          <div key={index} className="border-b theme-border/50 pb-3 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 border theme-border flex items-center justify-center font-display font-bold text-[10px] text-accent uppercase">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold theme-text">{review.name}</span>
                    <span className="text-[8px] bg-success/10 text-success py-0.5 px-1.5 rounded-full flex items-center gap-0.5 font-medium">
                      <CheckCircle className="w-2 h-2" /> Comprador
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] theme-muted">{review.date}</span>
            </div>
            <p className="text-[11px] theme-text-secondary leading-relaxed pl-9">{review.comment}</p>
            <div className="flex justify-start pl-9 mt-1.5">
              <button className="text-[10px] theme-muted hover:text-accent flex items-center gap-1 transition-colors cursor-pointer">
                <ThumbsUp className="w-2.5 h-2.5" /> Útil ({Math.floor(Math.random() * 12) + 1})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
