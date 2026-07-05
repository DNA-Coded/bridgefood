import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface MultilingualPreviewProps {
  summary?: { en: string; hi: string; bn: string };
  emailDraft?: { subject: string; body_en: string; body_hi: string; body_bn: string };
}


export const MultilingualPreview: React.FC<MultilingualPreviewProps> = ({ summary, emailDraft }) => {
  const [lang, setLang] = useState<'en' | 'hi' | 'bn'>('en');

  const getEmailBody = () => {
    if (!emailDraft) return '';
    if (lang === 'en') return emailDraft.body_en;
    if (lang === 'hi') return emailDraft.body_hi;
    return emailDraft.body_bn;
  };

  const getSubject = () => {
    return emailDraft?.subject || 'Food Donation Alert';
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-bold text-primary">Multilingual Messaging Preview</CardTitle>
        <div className="flex gap-1">
          {(['en', 'hi', 'bn'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 text-xs rounded-md uppercase font-bold transition-colors ${
                lang === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {l === 'en' ? 'ENG' : l === 'hi' ? 'HIN' : 'BEN'}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">Alert Summary</span>
          <p className="text-sm bg-muted p-3 rounded-md border border-border text-foreground">
            {summary?.[lang] || (summary && summary.en) || "No summary available."}
          </p>
        </div>

        {emailDraft && (
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">Email Template Draft</span>
            <div className="bg-muted p-3 rounded-md border border-border text-xs space-y-2 text-foreground">
              <p className="font-semibold text-foreground">Subject: {getSubject()}</p>
              <p className="whitespace-pre-line text-muted-foreground">{getEmailBody()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

