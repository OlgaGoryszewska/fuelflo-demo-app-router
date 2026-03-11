export default function StepNavigation({
  currentStep,
  setCurrentStep,
  totalSteps,
  submitting,

}) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
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
    <div className="form-footer">
      {/* Previous Button */}
      <button type="button" onClick={goPrevious} disabled={isFirstStep}>
        Back
      </button>

      {/* Submit on last step, Next on others */}
      {!isLastStep ? (
        <button type="button" onClick={goNext}>
          Next
        </button>
      ) : (
        <button type="submit" disabled={submitting}>
          Submit
        </button>
      )}
    </div>
  );
}
