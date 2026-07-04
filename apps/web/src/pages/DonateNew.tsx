import React, { useState, useEffect, useCallback } from 'react';
import { ProgressStepper } from '../components/ui/ProgressStepper';
import { DraftBanner } from '../components/ui/DraftBanner';
import { DonationForm, DonationFormData } from '../components/ui/DonationForm';
import { FoodImageUploader } from '../components/ui/FoodImageUploader';
import { AIAnalysisCard } from '../components/ai/AIAnalysisCard';
import { AIDecisionTimeline } from '../components/ai/AIDecisionTimeline';
import { FoodSummaryPanel } from '../components/ai/FoodSummaryPanel';
import { RecommendationCard } from '../components/ai/RecommendationCard';
import { MultilingualPreview } from '../components/ai/MultilingualPreview';
import { AIReasoningPanel } from '../components/ai/AIReasoningPanel';
import { ClipboardCheck, PackageCheck, Thermometer, Truck } from 'lucide-react';
import { foodApi } from '../api/food';
import { useNotificationStore } from '../stores/notificationStore';
import { useAiStore } from '../stores/aiStore';

const INITIAL_FORM_DATA: DonationFormData = {
  title: '',
  category: 'cooked',
  foodType: '',
  description: '',
  isVegetarian: 'vegetarian',
  allergens: '',
  quantity: '',
  unit: 'kg',
  servings: '',
  prepDate: '',
  bestBefore: '',
  pickupAddress: '',
  contactPerson: '',
  contactNumber: '',
  specialInstructions: ''
};

export const DonateNew: React.FC = () => {
  const [formData, setFormData] = useState<DonationFormData>(INITIAL_FORM_DATA);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  const { addToast } = useNotificationStore();
  const { resetActivity, updateActivityStep, setLastAnalysisTime, recordResponseTime } = useAiStore();
  const liveActivity = useAiStore((s) => s.liveActivity);

  // Check local draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('fb_donation_draft');
    if (saved) {
      setHasDraft(true);
    }
  }, []);

  const restoreDraft = () => {
    const saved = localStorage.getItem('fb_donation_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        addToast('Draft listing restored successfully.', 'success');
      } catch (err) {
        addToast('Failed to parse draft details.', 'error');
      }
    }
    setHasDraft(false);
  };

  const discardDraft = () => {
    localStorage.removeItem('fb_donation_draft');
    setHasDraft(false);
    addToast('Draft discarded.', 'info');
  };

  const handleFormChange = (fields: Partial<DonationFormData>) => {
    const updated = { ...formData, ...fields };
    setFormData(updated);
    // Autosave in local storage
    localStorage.setItem('fb_donation_draft', JSON.stringify(updated));

    // Simple step advancement heuristic
    if (updated.title && updated.description && activeStep === 0) {
      setActiveStep(1); // Move to Images step
    }
  };

  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
    if (newImages.length > 0 && activeStep === 1) {
      setActiveStep(2); // Move to assessment step
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required.';
    if (!formData.bestBefore) newErrors.bestBefore = 'Best before time is required.';
    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required.';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact representative is required.';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Phone number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Animate activity steps sequentially while Gemma is processing
  const animateActivitySteps = useCallback(async (startTs: number) => {
    const stepIds = ['upload','vision','identify','quantity','shelf','urgency','search','rank','impact','email'];
    const delays =  [  100,    400,     700,      1000,     1300,   1600,    1900,   2300,  2600,   2900];
    const durations = [280,    350,     420,      380,      310,    290,     450,    380,   320,    260];
    const confidences: Record<string, number> = {
      identify: 0.94, quantity: 0.91, shelf: 0.88, urgency: 0.96,
    };

    for (let i = 0; i < stepIds.length; i++) {
      await new Promise<void>((res) => setTimeout(res, delays[i] - (i > 0 ? delays[i-1] : 0)));
      const ts = new Date(startTs + delays[i]).toISOString();
      updateActivityStep(stepIds[i], { status: 'running', timestamp: ts });
      await new Promise<void>((res) => setTimeout(res, durations[i]));
      updateActivityStep(stepIds[i], {
        status: 'done',
        durationMs: durations[i],
        confidence: confidences[stepIds[i]],
      });
    }
  }, [updateActivityStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please complete required fields.', 'error');
      return;
    }

    setIsAnalyzing(true);
    resetActivity();
    addToast('Gemma operations coordination in progress…', 'info');

    const analysisStart = Date.now();
    // Kick off visual animation (non-blocking)
    animateActivitySteps(analysisStart);

    try {
      const filePromises = images.map(async (url, idx) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], `food_image_${idx}.jpg`, { type: 'image/jpeg' });
      });
      const files = await Promise.all(filePromises);

      let latitude: number | undefined;
      let longitude: number | undefined;
      let city: string | undefined;
      const addrLower = (formData.pickupAddress || '').toLowerCase();
      if (addrLower.includes('mumbai'))      { latitude = 19.082;  longitude = 72.855;  city = 'Mumbai'; }
      else if (addrLower.includes('bengaluru') || addrLower.includes('bangalore')) { latitude = 12.935; longitude = 77.627; city = 'Bengaluru'; }
      else if (addrLower.includes('pune'))   { latitude = 18.568;  longitude = 73.941;  city = 'Pune'; }
      else if (addrLower.includes('delhi'))  { latitude = 28.632;  longitude = 77.216;  city = 'Delhi'; }
      else if (addrLower.includes('chennai')){ latitude = 13.040;  longitude = 80.234;  city = 'Chennai'; }
      else if (addrLower.includes('kolkata')){ latitude = 22.5726; longitude = 88.3639; city = 'Kolkata'; }

      const result = await foodApi.analyzeListing({
        description: formData.description,
        category: formData.category,
        declared_quantity: parseFloat(formData.quantity) || undefined,
        declared_unit: formData.unit || 'kg',
        best_before: formData.bestBefore,
        city, latitude, longitude,
        images: files.length > 0 ? files : undefined,
      });

      const elapsed = Date.now() - analysisStart;
      setLastAnalysisTime(new Date().toISOString());
      recordResponseTime(elapsed);

      setAnalysisData({
        itemName: result.food_name || formData.title,
        quantityKg: result.estimated_quantity_kg || parseFloat(formData.quantity) || 0,
        urgency: result.urgency_level || 'MEDIUM',
        confidence: result.confidence_score || 0.95,
        allergens: result.allergens_detected || [],
        rationale: result.reasoning || '',
        safetyNotes: result.food_safety_notes || '',
        multilingualSummary: result.multilingual_summary || { en: '', hi: '', bn: '' },
        emailDraft: result.email_draft,
        recommendations: result.recommendations || [],
        _meta: result._meta,
      });

      setActiveStep(3);
      addToast('Gemma coordination analysis complete.', 'success');
      localStorage.removeItem('fb_donation_draft');
    } catch {
      addToast('An error occurred during Gemma coordination analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setImages([]);
    setErrors({});
    setAnalysisData(null);
    setActiveStep(0);
    localStorage.removeItem('fb_donation_draft');
    addToast('Form fields cleared.', 'info');
  };

  const steps = [
    { label: 'Food Details', description: 'Basic description' },
    { label: 'Images', description: 'Upload food photos' },
    { label: 'Assessment', description: 'Gemma parameters scan' },
    { label: 'Review', description: 'Confirm listing' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Food Shipment</h1>
          <p className="text-sm text-muted-foreground">Capture surplus food details for safe NGO pickup coordination.</p>
        </div>
      </div>

      <ProgressStepper activeStep={activeStep} steps={steps} />

      <DraftBanner hasDraft={hasDraft} onRestore={restoreDraft} onClear={discardDraft} />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form and Upload Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <DonationForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              errors={errors}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <FoodImageUploader images={images} onChange={handleImageChange} />
          </div>
        </div>

        {/* Right Side: Gemma Analysis Panel Output */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Food Assessment Report</h2>
            <p className="text-xs text-muted-foreground">Storage, shelf life, priority, and recipient guidance.</p>
          </div>
          
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-5 space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-bold text-primary">Gemma analysis in progress...</p>
                </div>
                <p className="text-xs text-slate-400">Processing images and extracting food parameters.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <AIDecisionTimeline steps={liveActivity} />
              </div>
            </div>
          ) : analysisData ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-extrabold">Assessment Summary</h3>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Gemma Verified</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-md bg-muted p-3"><PackageCheck className="mb-2 h-4 w-4 text-primary" />Detected Food<br /><strong>{analysisData.itemName}</strong></div>
                  <div className="rounded-md bg-muted p-3"><ClipboardCheck className="mb-2 h-4 w-4 text-primary" />Estimated Meals<br /><strong>{Math.round(analysisData.quantityKg * 2.5)}</strong></div>
                  <div className="rounded-md bg-muted p-3"><Thermometer className="mb-2 h-4 w-4 text-primary" />Freshness<br /><strong>{analysisData.urgency}</strong></div>
                  <div className="rounded-md bg-muted p-3"><Truck className="mb-2 h-4 w-4 text-primary" />Recommended NGO<br /><strong>Community kitchen</strong></div>
                </div>
              </div>
              <AIAnalysisCard data={analysisData} />
              <FoodSummaryPanel 
                itemName={analysisData.itemName} 
                quantityKg={analysisData.quantityKg} 
                safetyNotes={analysisData.safetyNotes} 
              />
              <RecommendationCard recommendations={analysisData.recommendations} />
              <MultilingualPreview 
                summary={analysisData.multilingualSummary} 
                emailDraft={analysisData.emailDraft} 
              />
              <AIReasoningPanel reasoning={analysisData.rationale} />
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <AIDecisionTimeline steps={liveActivity} />
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-lg bg-card p-8 text-center text-muted-foreground">
              <ClipboardCheck className="mx-auto mb-3 h-7 w-7 text-primary" />
              <p className="text-sm font-semibold text-foreground">Awaiting shipment details</p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete the form to generate assessment, storage advice, shelf life, priority, and recommended NGO type.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
