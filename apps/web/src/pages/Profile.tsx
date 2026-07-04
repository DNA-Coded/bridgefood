import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Organization Representative Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-350">Name: Sarah Jenkins</p>
          <p className="text-sm text-slate-350">Verification Status: Verified NGO Node</p>
        </CardContent>
      </Card>
    </div>
  );
};
