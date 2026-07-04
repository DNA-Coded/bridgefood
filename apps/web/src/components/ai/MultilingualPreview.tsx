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
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-bold text-teal-400">Multilingual Messaging Preview</CardTitle>
        <div className="flex gap-1">
          {(['en', 'hi', 'bn'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 text-xs rounded uppercase font-bold transition-colors ${
                lang === l ? 'bg-primary text-primary-foreground' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {l === 'en' ? 'ENG' : l === 'hi' ? 'HIN' : 'BEN'}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Alert Summary</span>
          <p className="text-sm bg-slate-850 p-3 rounded border border-slate-750 text-slate-350">
            {summary?.[lang] || (summary && summary.en) || "No summary available."}
          </p>
        </div>

        {emailDraft && (
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Email Template Draft</span>
            <div className="bg-slate-850 p-3 rounded border border-slate-750 text-xs space-y-2 text-slate-350">
              <p className="font-semibold text-slate-200">Subject: {getSubject()}</p>
              <p className="whitespace-pre-line">{getEmailBody()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

