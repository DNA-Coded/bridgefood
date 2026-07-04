import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UrgencyBadge, UrgencyLevel } from './UrgencyBadge';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { Badge } from '../ui/Badge';

export type AIAnalysisData = {
  itemName: string;
  quantityKg: number;
  urgency: UrgencyLevel;
  confidence: number;
  allergens: string[];
  rationale: string;
};

export const AIAnalysisCard: React.FC<{ data: AIAnalysisData }> = ({ data }) => {
  return (
    <Card className="relative overflow-hidden border border-border bg-card">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="primary" className="opacity-90 font-bold">Gemma Coordinator</Badge>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">AI Extraction Report</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Identified Item</span>
          <p className="text-base font-bold text-foreground">{data.itemName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Estimated Weight</span>
            <p className="text-sm font-semibold text-foreground">{data.quantityKg} kg</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Priority Rating</span>
            <div className="mt-1">
              <UrgencyBadge urgency={data.urgency} />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <ConfidenceIndicator score={data.confidence} />
        </div>

        {data.allergens.length > 0 && (
          <div className="pt-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-1">Detected Allergen Warnings</span>
            <div className="flex flex-wrap gap-1">
              {data.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline" className="capitalize text-destructive border-destructive/20 bg-destructive/5 font-semibold">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Extraction Reasoning</span>
          <p className="mt-1 text-xs italic text-muted-foreground">"{data.rationale}"</p>
        </div>
      </CardContent>
    </Card>
  );
};
