import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Requests: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Active Pickup Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inbound Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pending matching requests dispatched from nearby rescue agencies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
