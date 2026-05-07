export default function StepNavigation({
  currentStep,
  setCurrentStep,
  totalSteps,
  submitting,
  onSubmit,
  onValidateStep,
  submitLabel = 'Save transaction',
}) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
    if (onValidateStep && !onValidateStep(currentStep)) {
      return;
    }

    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={goPrevious}
        disabled={isFirstStep}
        className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm transition active:scale-[0.98] disabled:opacity-40"
      >
        Back
      </button>

      {!isLastStep ? (
        <button
          type="button"
          onClick={goNext}
          className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5]"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          disabled={submitting}
          className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[#d5eefc] bg-[#eef4fb] px-4 text-sm font-semibold text-gray-900 shadow-sm transition active:scale-[0.98] active:bg-[#dbeaf5] disabled:opacity-50"
          onClick={onSubmit}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      )}
    </div>
  );
}
