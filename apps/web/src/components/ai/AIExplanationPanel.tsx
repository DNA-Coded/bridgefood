import React from 'react';

export interface ExplainabilityData {
  detectedFood: string;
  category: string;
  estimatedWeightKg: number;
  estimatedServings: number;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  urgencyReason: string;
  shelfLifeHours: number;
  confidence: number;
  reasoning: string;
  recommendedOrgTypes: Array<{ type: string; reason: string }>;
  excludedOrgTypes: Array<{ type: string; reason: string }>;
  allergens: string[];
}

interface AIExplainabilityPanelProps {
  data: ExplainabilityData;
}

const URGENCY_CONFIG = {
  LOW:      { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', label: 'Low Priority' },
  NORMAL:   { color: 'text-sky-600 dark:text-sky-400',         bg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800',         label: 'Normal Priority' },
  HIGH:     { color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', label: 'High Priority' },
  CRITICAL: { color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',         label: 'Critical' },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">{title}</span>
    {children}
  </div>
);

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-primary' : pct >= 65 ? 'bg-amber-500' : 'bg-destructive';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Extraction Confidence</span>
        <span className="text-xs font-bold text-primary tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400">
        {pct >= 85 ? 'High confidence — data suitable for immediate dispatch.' : pct >= 65 ? 'Moderate confidence — manual verification recommended.' : 'Low confidence — please verify details before dispatching.'}
      </p>
    </div>
  );
};

function formatShelfLife(hours: number): { text: string; urgent: boolean } {
  if (hours <= 2) return { text: `${hours}h remaining`, urgent: true };
  if (hours <= 6) return { text: `${hours}h remaining`, urgent: true };
  if (hours < 24) return { text: `${hours}h remaining`, urgent: false };
  const days = Math.floor(hours / 24);
  return { text: `${days}d ${hours % 24}h remaining`, urgent: false };
}

export const AIExplainabilityPanel: React.FC<AIExplainabilityPanelProps> = ({ data }) => {
  const urgencyCfg = URGENCY_CONFIG[data.urgency] ?? URGENCY_CONFIG.NORMAL;
  const shelf = formatShelfLife(data.shelfLifeHours);

  return (
    <div className="space-y-5">
      {/* Header badge */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm shrink-0">
          🤖
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">Gemma Explainability Report</p>
          <p className="text-[10px] text-slate-400 mt-0.5">AI-generated reasoning — not a manual assessment</p>
        </div>
      </div>

      {/* Detected food + specs */}
      <Section title="Detected Food">
        <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{data.detectedFood}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            📦 {data.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            ⚖️ {data.estimatedWeightKg} kg
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            🍽️ ~{data.estimatedServings} servings
          </span>
        </div>
      </Section>

      {/* Confidence bar */}
      <ConfidenceBar score={data.confidence} />

      {/* Urgency */}
      <Section title="Urgency Assessment">
        <div className={`rounded-lg border p-3 space-y-1 ${urgencyCfg.bg}`}>
          <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{data.urgencyReason}</p>
        </div>
      </Section>

      {/* Shelf life */}
      <Section title="Shelf Life">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${shelf.urgent ? 'text-destructive' : 'text-slate-800 dark:text-slate-200'}`}>
            {shelf.text}
          </span>
          {shelf.urgent && (
            <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
              Act now
            </span>
          )}
        </div>
      </Section>

      {/* Allergens */}
      {data.allergens.length > 0 && (
        <Section title="Detected Allergens">
          <div className="flex flex-wrap gap-1">
            {data.allergens.map((a) => (
              <span
                key={a}
                className="inline-flex items-center rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-[10px] font-semibold text-destructive capitalize"
              >
                ⚠️ {a}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Reasoning narrative */}
      <Section title="Gemma's Reasoning">
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
            "{data.reasoning}"
          </p>
        </div>
      </Section>

      {/* Recommended org types */}
      {data.recommendedOrgTypes.length > 0 && (
        <Section title="Recommended Organization Types">
          <div className="space-y-2">
            {data.recommendedOrgTypes.map((item) => (
              <div key={item.type} className="flex gap-2 items-start">
                <span className="text-primary mt-0.5 shrink-0 text-xs">✓</span>
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.type}</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Excluded org types */}
      {data.excludedOrgTypes.length > 0 && (
        <Section title="Excluded Categories">
          <div className="space-y-2">
            {data.excludedOrgTypes.map((item) => (
              <div key={item.type} className="flex gap-2 items-start">
                <span className="text-slate-400 mt-0.5 shrink-0 text-xs">✗</span>
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.type}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
