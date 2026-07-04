import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const About: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">About FoodBridge</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mission & Values</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            FoodBridge matches edible food surplus with local NGOs, shelters, and food banks. Gemma quietly supports assessment and matching so operations teams can move food from donors to communities faster.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
