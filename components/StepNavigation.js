export default function StepNavigation({ currentStep, setCurrentStep, totalSteps }) { 
    
    const goNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    }
    const goPrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    return (
        <div className="form-footer">
          <button type="button" onClick={goPrevious} disabled={currentStep === 0}>
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentStep === totalSteps - 1}
          >
            Next
          </button>
        </div>
      );
    }
