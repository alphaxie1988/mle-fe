import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import MultiSelect from "multiselect-react-dropdown";
import { skillsmap, categorymap, positionlevelmap, typemap } from "./typeahead";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {
  //                ___ _        _
  //   _  _ ___ ___/ __| |_ __ _| |_ ___
  //  | || (_-</ -_)__ \  _/ _` |  _/ -_)
  //   \_,_/__/\___|___/\__\__,_|\__\___|

  //Predict Page
  const [jobtitle, setJobtitle] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobSkills, setJobSkills] = useState([]);
  const [numberofvacancies, setNumberofvacancies] = useState(1);
  const [jobCategory, setJobCategory] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [jobPositionLevels, setPositionLevels] = useState([]);
  const [minimumYOE, setMinimumYOE] = useState(0);
  const [minimumSal, setMinimumSal] = useState(0);
  const [maximumSal, setMaximumSal] = useState(10000);
  //Predict
  const [pMinSal, setPMinSal] = useState([]);
  const [pMaxSal, setPMaxSal] = useState([]);

  //Stats Page
  const [statsData, setStatsData] = useState([]);

  //Admin Page
  const [outlierData, setOutlierData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  //                ___  __  __        _
  //   _  _ ___ ___| __|/ _|/ _|___ __| |_
  //  | || (_-</ -_) _||  _|  _/ -_) _|  _|
  //   \_,_/__/\___|___|_| |_| \___\__|\__|

  useEffect(() => {
    if (window.location.pathname === "/stats") {
      // Update the document title using the browser API
      if (!!statsData)
        axios.get("http://127.0.0.1:8080/stats").then((resp) => {
          console.log(resp.data);
          setStatsData(resp.data);
        });
    } else if (window.location.pathname === "/admin") {
      if (!!outlierData)
        axios.get("http://127.0.0.1:8080/outlier").then((resp) => {
          setOutlierData(resp.data);
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8080/predict").then((resp) => {
      console.log(resp.data);
      setPMinSal(resp.data.pMinSal);
      setPMaxSal(resp.data.pMaxSal);
    });
  }, [minimumYOE]);

  //                   _   _  _              _ _
  //   _____ _____ _ _| |_| || |__ _ _ _  __| | |___ _ _
  //  / -_) V / -_) ' \  _| __ / _` | ' \/ _` | / -_) '_|
  //  \___|\_/\___|_||_\__|_||_\__,_|_||_\__,_|_\___|_|

  const handleCheckbox = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setSelectedRows(selectedRows.map((a) => a.uuid));
  };

  const handleSetAddToTrainOrHide = (selectedRows, action) => {
    axios
      .put("http://127.0.0.1:8080/outlier", {
        payload: selectedRows,
        action: action,
      })
      .then((resp) => {
        console.log(resp.data);
        if (resp.data.success) {
          axios.get("http://127.0.0.1:8080/outlier").then((resp) => {
            setOutlierData(resp.data);
          });
        }
      });
  };

  //           _
  //   _ _ ___| |_ _  _ _ _ _ _
  //  | '_/ -_)  _| || | '_| ' \
  //  |_| \___|\__|\_,_|_| |_||_|

  if (window.location.pathname === "/stats") {
    // ___ _        _
    // / __| |_ __ _| |_ ___
    // \__ \  _/ _` |  _(_-<
    // |___/\__\__,_|\__/__/

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-left">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="EmployerContainer">
              Administrator Page - Stats
            </span>
          </div>
          <div className="App-header-right">
            <img src="avatar.png" className="Avatar" alt="logo" />
            Admin
          </div>
        </header>
        <div className="Content">
          <div className="dataTableContainer">
            <h3>R² overtime</h3>
            <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={statsData.rsquarevalue}>
                <CartesianGrid />
                <XAxis dataKey="name" interval={"preserveStartEnd"} />
                <YAxis></YAxis>
                <Legend />
                <Tooltip />
                <Line
                  dataKey="R Square Value"
                  stroke="black"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <h3>RSME overtime</h3>{" "}
            <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={statsData.RSME}>
                <CartesianGrid />
                <XAxis dataKey="name" interval={"preserveStartEnd"} />
                <YAxis></YAxis>
                <Legend />
                <Tooltip />
                <Line dataKey="RSME" stroke="black" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            <h3>New Job Overtime</h3>
            <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={statsData.newjob}>
                <CartesianGrid />
                <XAxis dataKey="name" interval={"preserveStartEnd"} />
                <YAxis></YAxis>
                <Legend />
                <Tooltip />
                <Line dataKey="New Job" stroke="black" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  } else if (window.location.pathname === "/admin") {
    //    _      _       _
    //   /_\  __| |_ __ (_)_ _
    //  / _ \/ _` | '  \| | ' \
    // /_/ \_\__,_|_|_|_|_|_||_|

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-left">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="EmployerContainer">
              Administrator Page - Review
            </span>
          </div>
          <div className="App-header-right">
            <img src="avatar.png" className="Avatar" alt="logo" />
            Admin
          </div>
        </header>
        <div className="Content">
          <div className="dataTableContainer">
            <DataTable
              columns={[
                {
                  name: "Title",
                  selector: (row) => row.title,
                },
                {
                  name: "Description",
                  selector: (row) => row.description,
                },
                {
                  name: "Skills",
                  selector: (row) => row.skills,
                },
                {
                  name: "Number Of Vacancies",
                  selector: (row) => row.numberofvacancies,
                },
                {
                  name: "Category",
                  selector: (row) => row.categories,
                },
                {
                  name: "Position Levels",
                  selector: (row) => row.positionlevels,
                },
                {
                  name: "Minimum Salary",
                  selector: (row) => row.minsalary,
                },
                {
                  name: "Maximum Salary",
                  selector: (row) => row.maxsalary,
                },
                {
                  name: "Remarks",
                  selector: (row) => row.remarks.slice(0, -1),
                },
              ]}
              data={outlierData}
              selectableRows
              onSelectedRowsChange={handleCheckbox}
            />
            <button
              className="redButton"
              onClick={() => handleSetAddToTrainOrHide(selectedRows, "Add")}
            >
              Add to Training
            </button>
            <button
              onClick={() => handleSetAddToTrainOrHide(selectedRows, "Hide")}
            >
              Hide from Table
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    //  ___            _ _    _
    // | _ \_ _ ___ __| (_)__| |_
    // |  _/ '_/ -_) _` | / _|  _|
    // |_| |_| \___\__,_|_\__|\__|

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-left">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="EmployerContainer">Employer</span>
          </div>

          <div className="App-header-right">
            <img src="avatar.png" className="Avatar" alt="logo" />
            Testing Account
          </div>
        </header>
        <div className="Content">
          <div className="formbody">
            <form action="#">
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
              <label>Job Type</label>
              <MultiSelect
                type="text"
                options={typemap}
                displayValue="label"
                placeholder="Add more Job Type"
                selectedValues={jobType}
                onSelect={setJobType}
                onRemove={setJobType}
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
              <label>Min Salary - ${pMinSal.toLocaleString()}</label>
              <input
                type="number"
                min="0"
                value={minimumSal}
                onChange={(e) => setMinimumSal(e.target.value)}
              ></input>
              <label>Max Salary- ${pMaxSal.toLocaleString()}</label>
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
}

export default App;
