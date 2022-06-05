import React, { useState } from "react";
import logo from "./logo.png";
import "./App.css";
import MultiSelect from "multiselect-react-dropdown";
import { skillsmap, categorymap, positionlevelmap } from "./typeahead";

function App() {
  const [jobtitle, setJobtitle] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobSkills, setJobSkills] = useState([]);
  const [numberofvacancies, setNumberofvacancies] = useState(1);
  const [jobCategory, setJobCategory] = useState([]);
  const [jobPositionLevels, setPositionLevels] = useState([]);
  const [minimumYOE, setMinimumYOE] = useState(0);
  const [minimumSal, setMinimumSal] = useState(0);
  const [maximumSal, setMaximumSal] = useState(10000);
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-left">
          <img src={logo} className="App-logo" alt="logo" />
          <span>Employer</span>
        </div>
        <div className="App-header-right">Testing Account</div>
      </header>
      <div className="Content">
        <div className="formbody">
          <form action="/action_page.php">
            <label>Job Title</label>
            <input
              type="text"
              name="jobtitle"
              onChange={(e) => setJobtitle(e.target.value)}
              value={jobtitle}
            ></input>
            <label>Job Description & Requirements</label>
            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
            ></textarea>
            <label>Skills based on job description</label>
            <MultiSelect
              type="text"
              options={skillsmap}
              displayValue="label"
              placeholder="Add more skills"
              selectionLimit={5}
              selectedValues={jobSkills}
              onSelect={setJobSkills}
              onRemove={setJobSkills}
            ></MultiSelect>
            <label>Number of Vacancies</label>
            <input
              type="number"
              min="1"
              value={numberofvacancies}
              onChange={(e) => setNumberofvacancies(e.target.value)}
            ></input>
            <label>Job Category</label>
            <MultiSelect
              type="text"
              options={categorymap}
              displayValue="label"
              placeholder="Add more category"
              selectedValues={jobCategory}
              onSelect={setJobCategory}
              onRemove={setJobCategory}
            ></MultiSelect>

            <label>Position Level</label>
            <MultiSelect
              type="text"
              options={positionlevelmap}
              displayValue="label"
              placeholder="Add more Position Level"
              selectionLimit={3}
              selectedValues={jobPositionLevels}
              onSelect={setPositionLevels}
              onRemove={setPositionLevels}
            ></MultiSelect>
            {/* <label>Employment Type</label>
            <input type="text"></input> */}
            <label>Minimum Years of Experience</label>
            <input
              type="number"
              min="0"
              value={minimumYOE}
              onChange={(e) => setMinimumYOE(e.target.value)}
            ></input>
            <label>Min Salary</label>
            <input
              type="number"
              min="0"
              value={minimumSal}
              onChange={(e) => setMinimumSal(e.target.value)}
            ></input>
            <label>Max Salary</label>
            <input
              type="number"
              min="0"
              value={maximumSal}
              onChange={(e) => setMaximumSal(e.target.value)}
            ></input>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
