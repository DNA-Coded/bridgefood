import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Contact: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact FoodBridge</h1>
      <Card>
        <CardHeader>
          <CardTitle>Technical Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For operational enquiries, onboarding support, or partner coordination, reach out to support@foodbridge.ai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
