import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface FoodSummaryPanelProps {
  itemName: string;
  quantityKg: number;
  safetyNotes: string;
}

export const FoodSummaryPanel: React.FC<FoodSummaryPanelProps> = ({ itemName, quantityKg, safetyNotes }) => {
  return (
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-teal-400">Gemma Summary Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Identified Item:</span>
          <span className="font-semibold">{itemName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Estimated Weight:</span>
          <span className="font-semibold">{quantityKg} kg</span>
        </div>
        <div className="flex flex-col gap-1 border-t border-slate-800 pt-2">
          <span className="text-slate-400">Recommended Storage:</span>
          <span className="font-semibold text-emerald-400 text-xs mt-0.5">{safetyNotes || "Maintain ambient temperature."}</span>
        </div>
      </CardContent>
    </Card>
  );
};

