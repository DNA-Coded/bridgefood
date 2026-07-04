import React, { useState } from 'react';
import { OrgProfile } from '../../api/organizations';
import { Button } from './Button';

export const CompatibilityBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 90) return 'bg-success/10 text-success border-success/30';
    if (score >= 70) return 'bg-warning/10 text-warning border-warning/30';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getColor()}`}>
      Gemma Suggested: {score}%
    </div>
  );
};

export const CapacityIndicator: React.FC<{ level: number }> = ({ level }) => {
  const getColor = () => {
    if (level >= 80) return 'bg-success';
    if (level >= 45) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
        <span>Storage Capacity</span>
        <span>{level}% Available</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all duration-300 ${getColor()}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
};

interface RequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  org: OrgProfile | null;
  onConfirm: (message: string) => void;
}

export const RequestDonationDialog: React.FC<RequestDialogProps> = ({
  isOpen,
  onClose,
  org,
  onConfirm
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen || !org) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-6 shadow-2xl">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Send Pickup Request</h3>
            <p className="text-xs text-muted-foreground">Request dispatch matching to: {org.name}</p>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted p-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Estimated Distance:</span>
            <span className="font-semibold text-foreground">{org.distanceKm} km</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Est. Transit:</span>
            <span className="font-semibold text-foreground">{org.travelTimeMin} mins</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Hours:</span>
            <span className="font-semibold text-foreground">{org.operatingHours}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Custom Coordination Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add special instructions, door access codes, or timing details for the collection team..."
            className="min-h-[80px] w-full rounded-md border border-border bg-card p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={() => onConfirm(message)} variant="primary" className="flex-1 text-xs">
            Confirm Request
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
