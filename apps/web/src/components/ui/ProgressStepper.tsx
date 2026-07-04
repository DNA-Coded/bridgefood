import React from 'react';

type Step = {
  label: string;
  description: string;
};

interface ProgressStepperProps {
  activeStep: number;
  steps: Step[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ activeStep, steps }) => {
  return (
    <div className="w-full py-4 border-b border-border mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success text-success-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="text-left">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden sm:block h-px w-8 bg-border ml-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
