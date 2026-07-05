import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface OrgRec {
  org_id: string;
  org_name: string;
  is_recommended: boolean;
  matching_score: number;
  expected_success: string;
  pickup_priority: string;
  reason: string;
}

interface RecommendationCardProps {
  recommendations: OrgRec[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Match Proximity Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div key={rec.org_id} className="border-b border-border pb-3 last:border-b-0 last:pb-0 space-y-2 text-foreground">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{rec.org_name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                  {Math.round(rec.matching_score * 100)}% Match
                </span>
              </div>
              <div className="bg-muted p-2.5 rounded-md border border-border text-xs">
                <div className="flex gap-3 mb-1 text-[10px] text-muted-foreground font-bold uppercase">
                  <span>Priority: <span className="text-warning">{rec.pickup_priority}</span></span>
                  <span>Success: <span className="text-success">{rec.expected_success}</span></span>
                </div>
                <p className="text-muted-foreground italic">"{rec.reason}"</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic text-center py-2">No compatible organizations found nearby.</p>
        )}
      </CardContent>
    </Card>
  );
};

