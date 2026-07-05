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
  LOW:      { color: 'text-success', bg: 'bg-success/10 border-success/20', label: 'Low Priority' },
  NORMAL:   { color: 'text-primary', bg: 'bg-primary/10 border-primary/20', label: 'Normal Priority' },
  HIGH:     { color: 'text-warning-foreground', bg: 'bg-warning/10 border-warning/20', label: 'High Priority' },
  CRITICAL: { color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'Critical' },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block">{title}</span>
    {children}
  </div>
);

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-primary' : pct >= 65 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-foreground">Extraction Confidence</span>
        <span className="text-xs font-bold text-primary tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
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
          <p className="text-xs font-bold text-foreground leading-none">Gemma Explainability Report</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">AI-generated reasoning — not a manual assessment</p>
        </div>
      </div>


      {/* Confidence bar */}
      <ConfidenceBar score={data.confidence} />

      {/* Urgency */}
      <Section title="Urgency Assessment">
        <div className={`rounded-lg border p-3 space-y-1 ${urgencyCfg.bg}`}>
          <span className={`text-xs font-bold ${urgencyCfg.color}`}>{urgencyCfg.label}</span>
          <p className="text-xs leading-relaxed text-muted-foreground">{data.urgencyReason}</p>
        </div>
      </Section>

      {/* Shelf life */}
      <Section title="Shelf Life">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${shelf.urgent ? 'text-destructive' : 'text-foreground'}`}>
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

      {/* Recommended org types */}
      {data.recommendedOrgTypes.length > 0 && (
        <Section title="Recommended Recipient Formats">
          <div className="flex flex-wrap gap-1.5">
            {data.recommendedOrgTypes.map((item) => (
              <span key={item.type} className="inline-flex items-center rounded-sm bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 capitalize">
                ✓ {item.type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Excluded org types */}
      {data.excludedOrgTypes.length > 0 && (
        <Section title="Incompatible Recipient Formats">
          <div className="flex flex-wrap gap-1.5">
            {data.excludedOrgTypes.map((item) => (
              <span key={item.type} className="inline-flex items-center rounded-sm bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
                ✗ {item.type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
