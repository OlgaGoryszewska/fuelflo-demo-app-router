'use client';
import Setup from '@/components/fuel-transaction/setup-form'
import StepNavigation from '@/components/StepNavigation';

export default function Wizzard() {
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction </h1>
      </div>
      <form className='p-2' >
        <Setup/>
        <StepNavigation/>

      </form>
    </div>
  );
}
