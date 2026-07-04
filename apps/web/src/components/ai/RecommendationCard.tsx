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
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-teal-400">Match Proximity Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div key={rec.org_id} className="border-b border-slate-800/60 pb-3 last:border-b-0 last:pb-0 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-200 font-semibold">{rec.org_name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold uppercase">
                  {Math.round(rec.matching_score * 100)}% Match
                </span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded border border-slate-705 text-xs">
                <div className="flex gap-3 mb-1 text-[10px] text-slate-400 font-bold uppercase">
                  <span>Priority: <span className="text-amber-400">{rec.pickup_priority}</span></span>
                  <span>Success: <span className="text-emerald-400">{rec.expected_success}</span></span>
                </div>
                <p className="text-slate-300 italic">"{rec.reason}"</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-2">No compatible organizations found nearby.</p>
        )}
      </CardContent>
    </Card>
  );
};

