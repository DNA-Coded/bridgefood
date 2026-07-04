import React from 'react';

interface AIReasoningPanelProps {
  reasoning?: string;
}

export const AIReasoningPanel: React.FC<AIReasoningPanelProps> = ({ reasoning }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white">
      <h4 className="text-sm font-bold text-teal-400 mb-2 uppercase tracking-wide">AI Routing Logic</h4>
      <div className="space-y-1.5 text-xs text-slate-300">
        {reasoning ? (
          <p className="leading-relaxed">{reasoning}</p>
        ) : (
          <p className="italic text-slate-500">Awaiting coordination rationale...</p>
        )}
      </div>
    </div>
  );
};

