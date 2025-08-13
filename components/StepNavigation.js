export default function StepNavigation({
  currentStep,
  setCurrentStep,
  totalSteps,
}) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
    if (!isLastStep) {
      setTimeout(() =>
        setCurrentStep(currentStep + 1),0);

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
        Previous
      </button>

      {/* Submit on last step, Next on others */}
      {!isLastStep ? (
        <button type="button" onClick={goNext}>
          Next
        </button>
      ) : (
        <button type="submit">Submit</button>
      )}
    </div>
  );
}
