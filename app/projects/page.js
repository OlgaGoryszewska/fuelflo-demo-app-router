import { MdAdd } from 'react-icons/md';



export default function Projects() {
  return (
    <form>
      <div className="form-header">
        <MdAdd className="icon" />
        <h1>Add new Project</h1>
      </div>
      <h2>Project Specification</h2>
      <label>
        Name of the Project:
        <input name="name" type="text" required className="border" />
      </label>
      <label>
        Name of the Project:
        <input name="location" type="text" required className="border" />
      </label>
      <label>
        Release Date:
        <input type="date" name="releaseDate" required className="border" />
      </label>
      <label>
        End Date:
        <input type="date" name="endDate" required className="border" />
      </label>
      <button>next</button>

      
      
    </form>
  );
}
