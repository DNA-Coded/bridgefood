import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16">
      {/* 1. Hero Section with Low-Opacity Background Cover (Full-Bleed Breakout) */}
      <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-12 md:py-20 px-6 flex items-center justify-center text-center">
        {/* Background image covering the entire hero with low opacity */}
        <div className="absolute inset-0 bg-[url('/hero-bg.webp')] bg-cover bg-center opacity-10 pointer-events-none"></div>
        
        {/* Centered content over the image */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Every Meal Saved is Another Family Fed.
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            FoodBridge AI intelligently coordinates surplus food from local businesses, hotels, and events to verified recipient kitchens and shelters in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => onNavigate('/role-selection')} className="px-6 py-2.5 bg-[#c39b62] text-white hover:bg-[#b38b52] font-semibold rounded-sm">
              Donate Surplus Food
            </Button>
            <Button onClick={() => onNavigate('/role-selection')} variant="outline" className="px-6 py-2.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold rounded-sm">
              Find Available Food
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Proximity Impact Metrics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { metric: '14,820', label: 'Verified Meals Saved' },
          { metric: '8,400 kg', label: 'Food Rescued' },
          { metric: '150+', label: 'Shelters Connected' },
          { metric: '12', label: 'Metro Cities Covered' }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center p-6 shadow-sm">
            <p className="text-3xl font-extrabold text-primary">{stat.metric}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* 3. Operational Steps */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">How FoodBridge Coordinates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">A seamless lifecycle designed to reduce food rescue dispatch latency from days to minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '1. Create surplus listing', text: 'Food donors upload raw photos and a simple description of excess supplies.' },
            { title: '2. Gemma AI analysis', text: 'Gemma extracts volume, safe holding limits, and recommends suitable shelters.' },
            { title: '3. Proximity NGO pickup', text: 'Matched recipient organizations appeal for pickup and confirm completion.' }
          ].map((step, idx) => (
            <Card key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wide block">{step.title}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Gemma Highlight Panel */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl shrink-0">
          🤖
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Powered by Gemma</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Gemma coordinates matching parameters quietly behind the scenes. It scans text description files to extract volume metrics, analyzes preparing timestamps to calculate expiry timelines, schedules multilingual email alerts to local dispatch offices, and outlines match suggestions to ensure leftovers are matched safely.
          </p>
        </div>
      </Card>
    </div>
  );
};
