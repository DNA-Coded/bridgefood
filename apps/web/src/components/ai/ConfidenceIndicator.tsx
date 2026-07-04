import React from 'react';

export const ConfidenceIndicator: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.min(Math.max(score * 100, 0), 100);
  
  const getProgressColor = () => {
    if (percentage >= 85) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold mb-1">
        <span>Gemma Confidence Indicator</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div className={`h-full transition-all duration-500 ${getProgressColor()}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
