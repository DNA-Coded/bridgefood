import React from 'react';

interface AIReasoningPanelProps {
  reasoning?: string;
}

export const AIReasoningPanel: React.FC<AIReasoningPanelProps> = ({ reasoning }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-foreground">
      <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">AI Routing Logic</h4>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        {reasoning ? (
          <p className="leading-relaxed">{reasoning}</p>
        ) : (
          <p className="italic text-muted-foreground">Awaiting coordination rationale...</p>
        )}
      </div>
    </div>
  );
};

