import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Admin: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Operations Administration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Monitor platform health, Gemma availability, recent donations, audit logs, users, and organizations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
