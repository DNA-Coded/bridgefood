import React from 'react';

interface DraftBannerProps {
  hasDraft: boolean;
  onRestore: () => void;
  onClear: () => void;
}

export const DraftBanner: React.FC<DraftBannerProps> = ({ hasDraft, onRestore, onClear }) => {
  if (!hasDraft) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 text-foreground px-4 py-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 animate-in fade-in duration-300">
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Unsaved Listing Draft Detected</span>
        <span className="text-xs text-muted-foreground">You have a saved listing draft. Would you like to restore it?</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onRestore}
          className="flex-1 sm:flex-initial text-xs bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded hover:bg-primary/95 transition-colors"
        >
          Restore Draft
        </button>
        <button
          onClick={onClear}
          className="flex-1 sm:flex-initial text-xs border border-border text-muted-foreground font-semibold px-3 py-1.5 rounded hover:bg-muted transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
};
