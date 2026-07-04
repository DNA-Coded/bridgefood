import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Donate: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">List Surplus Food</h1>
      <Card>
        <CardHeader>
          <CardTitle>Intake Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create a food shipment record with assessment, pickup, and recipient coordination details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
