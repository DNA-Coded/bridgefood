import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Organization Representative Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Name: Sarah Jenkins</p>
          <p className="text-sm text-muted-foreground">Verification Status: Verified NGO Node</p>
        </CardContent>
      </Card>
    </div>
  );
};
