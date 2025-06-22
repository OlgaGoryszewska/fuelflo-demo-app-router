import { MdAdd } from 'react-icons/md';

export default function Projects() {
  return (
    <form>
      <div className="form-header">
        <MdAdd className="icon" />
        <h1>Add new Project</h1>
      </div>
      <div className="flex justify-center items-center mx-4">
        <div className="progresion-number">1</div>
        <div className="line"></div>
        <div className="progresion-number">2</div>
        <div className="line"></div>
        <div className="progresion-number">3</div>
        <div className="line "></div>
        <div className="progresion-number">4</div>
        <div className="line"></div>
        <div className="progresion-number">5</div>
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
      <div className="form-footer">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </form>
  );
}
