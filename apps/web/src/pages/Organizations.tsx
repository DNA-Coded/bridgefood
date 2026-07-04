import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Organizations: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nearby Recipient Organizations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ranked Organization List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Verified NGOs are shown as ranked operational records with capacity, storage, distance, pickup time, and matching rationale.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
