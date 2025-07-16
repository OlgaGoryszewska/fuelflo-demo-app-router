import React from 'react';

const steps = [1, 2, 3, 4, 5];

export default function ProgresionBar({ currentStep }) {
  return (
    <div className="flex w-auto justify-center items-center mx-4">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`progresion-number ${
              currentStep === index ? 'active-progresion-number' : ''
            }`}
          >
            {step}
          </div>
          {index !== steps.length - 1 && <div className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
