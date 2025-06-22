import { MdAdd } from 'react-icons/md';
import ProgresionBar from '@/components/ProgresionBar';
//import StepThree from '@/components/add_new_project/StepThree';
//import StepOne from '@/components/add_new_project/StepOne';
//import StepTwo from '@/components/add_new_project/StepTwo';
//import StepFour from '@/components/add_new_project/StepFour';
import StepFive from '@/components/add_new_project/StepFive';

export default function Projects() {
  return (
    <form>
      <div className="form-header">
        <MdAdd className="icon" />
        <h1>Add new Project</h1>
      </div>
      <ProgresionBar />
      {/* <StepOne/> */}
      {/* <StepTwo/> */}
      {/* <StepThree/> */}
      {/* <StepFour/> */}
      <StepFive />
      <div className="form-footer">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </form>
  );
}
