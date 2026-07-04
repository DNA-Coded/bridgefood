import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface FoodSummaryPanelProps {
  itemName: string;
  quantityKg: number;
  safetyNotes: string;
}

export const FoodSummaryPanel: React.FC<FoodSummaryPanelProps> = ({ itemName, quantityKg, safetyNotes }) => {
  return (
    <Card className="border border-border bg-card text-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Gemma Summary Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Identified Item:</span>
          <span className="font-semibold">{itemName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Weight:</span>
          <span className="font-semibold">{quantityKg} kg</span>
        </div>
        <div className="flex flex-col gap-1 border-t border-border pt-2">
          <span className="text-muted-foreground">Recommended Storage:</span>
          <span className="mt-0.5 text-xs font-semibold text-success">{safetyNotes || 'Maintain ambient temperature.'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

