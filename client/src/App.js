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

const productionFrontendURL = "https://mle-fe-zolecwvnzq-uc.a.run.app/";
const productionBackendURL = "https://mle-be-zolecwvnzq-uc.a.run.app";
const stagingFrontendURL = "https://mle-festaging-zolecwvnzq-uc.a.run.app/";
const stagingBackendURL = "https://mle-bestaging-zolecwvnzq-uc.a.run.app/";
const developmentFrontendURL1 = "http://localhost:3000";
const developmentFrontendURL2 = "http://127.0.0.1:3000";
const developmentBackendURL = "http://localhost:8080";

const getBackendURL = () => {
  if (productionFrontendURL.indexOf(window.location.hostname) !== -1) {
    return productionBackendURL;
  }
  if (stagingFrontendURL.indexOf(window.location.hostname) !== -1) {
    return stagingBackendURL;
  }
  if (
    developmentFrontendURL1.indexOf(window.location.hostname) !== -1 ||
    developmentFrontendURL2.indexOf(window.location.hostname) !== -1
  ) {
    return developmentBackendURL;
  }
};
function App() {
  //                ___ _        _
  //   _  _ ___ ___/ __| |_ __ _| |_ ___
  //  | || (_-</ -_)__ \  _/ _` |  _/ -_)
  //   \_,_/__/\___|___/\__\__,_|\__\___|

  //Predict Page usestate-
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
  const [displaySpinner, setDisplaySpinner] = useState(true);

  //Stats Page
  const [statsData, setStatsData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [modelData, setModelData] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);
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
        axios.get(`${getBackendURL()}/stats`).then((resp) => {
          setStatsData(resp.data);
        });
    } else if (window.location.pathname === "/model") {
      if (!!modelData)
        axios.get(`${getBackendURL()}/model`).then((resp) => {
          setModelData(resp.data);
        });
    } else if (window.location.pathname === "/admin") {
      if (!!outlierData)
        axios.get(`${getBackendURL()}/outlier`).then((resp) => {
          setOutlierData(resp.data);
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setDisplaySpinner(true);
    axios
      .post(`${getBackendURL()}/predict`, {
        // jobtitle: jobtitle,
        // jobDescription: jobDescription,
        // jobSkills: jobSkills,
        numberofvacancies: numberofvacancies,
        jobCategory: jobCategory,
        jobType: jobType,
        jobPositionLevels: jobPositionLevels,
        minimumYOE: minimumYOE,
      })
      .then((resp) => {
        setDisplaySpinner(false);
        setPMinSal(resp.data.pMinSal);
        setPMaxSal(resp.data.pMaxSal);
      }); // eslint-disable-next-line
  }, [minimumYOE, jobPositionLevels, numberofvacancies, jobCategory, jobType]);

  //                   _   _  _              _ _
  //   _____ _____ _ _| |_| || |__ _ _ _  __| | |___ _ _
  //  / -_) V / -_) ' \  _| __ / _` | ' \/ _` | / -_) '_|
  //  \___|\_/\___|_||_\__|_||_\__,_|_||_\__,_|_\___|_|

  const handleCheckbox = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    setSelectedRows(selectedRows.map((a) => a.uuid));
  };
  const handleCheckbox2 = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data

    setSelectedRows2(selectedRows.map((a) => a.id));
  };

  const handleSetAddToTrainOrHide = (selectedRows, action) => {
    axios
      .put(`${getBackendURL()}/outlier`, {
        payload: selectedRows,
        action: action,
      })
      .then((resp) => {
        if (resp.data.success) {
          axios.get(`${getBackendURL()}/outlier`).then((resp) => {
            setOutlierData(resp.data);
          });
        }
      });
  };
  const handleSetModel = () => {
    axios
      .put(`${getBackendURL()}/model`, {
        payload: selectedRows2[0],
      })
      .then((resp) => {
        if (resp.data.success) {
          axios.get(`${getBackendURL()}/model`).then((resp) => {
            setModelData(resp.data);
          });
        }
      });
  };
  const handleStartNewCrawl = () => {
    if (window.confirm("You sure you want to start crawling?") === true) {
      setButtonDisabled(true);
      axios.get(`${getBackendURL()}/crawl`).then((resp) => {
        alert(resp.data);
        setButtonDisabled(false);
      });
    } else {
    }
  };
  //    ___                                  _
  //   / __|___ _ __  _ __  ___ _ _  ___ _ _| |_
  //  | (__/ _ \ '  \| '_ \/ _ \ ' \/ -_) ' \  _|
  //   \___\___/_|_|_| .__/\___/_||_\___|_||_\__|
  //                 |_|
  const Header = (props) => {
    return (
      <header className="App-header">
        <div className="App-header-left">
          <img src={logo} className="App-logo" alt="logo" />
          <span className="EmployerContainer">{props.title}</span>
          {stagingFrontendURL.indexOf(window.location.hostname) !== -1 && (
            <span className="EmployerContainer">STAGING</span>
          )}
          {(developmentFrontendURL1.indexOf(window.location.hostname) !== -1 ||
            developmentFrontendURL2.indexOf(window.location.hostname) !==
              -1) && <span className="EmployerContainer">DEVELOPMENT</span>}
        </div>
        <div className="App-header-right">
          <div
            className={
              "menuItem " +
              (window.location.pathname === "/model" && "selected")
            }
            onClick={() => (window.location = "/model")}
          >
            Model
          </div>
          <div
            className={
              "menuItem " +
              (window.location.pathname === "/stats" && "selected")
            }
            onClick={() => (window.location = "/stats")}
          >
            Statistics
          </div>
          <div
            className={
              "menuItem " +
              (window.location.pathname === "/admin" && "selected")
            }
            onClick={() => (window.location = "/admin")}
          >
            Admin
          </div>
          <div
            className={
              "menuItem " +
              ((window.location.pathname === "/predict" ||
                window.location.pathname === "/") &&
                "selected")
            }
            onClick={() => (window.location = "/predict")}
          >
            Predict
          </div>
          <img src="avatar.png" className="Avatar" alt="logo" />
          {props.userName}
        </div>
      </header>
    );
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
        <Header
          title="Administrator Page - Statistics"
          userName="Admin"
        ></Header>
        <div className="Content">
          <div className="dataTableContainer">
            <h3>R² overtime</h3>
            <div className="whitebackground">
              <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={statsData.rsquarevalue}>
                  <CartesianGrid />
                  <XAxis dataKey="name" interval={"preserveStartEnd"} />
                  <YAxis></YAxis>
                  <Legend />
                  <Tooltip />
                  <Line
                    dataKey="Max R² Value"
                    stroke="blue"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    dataKey="Min R² Value"
                    stroke="Red"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h3>RMSE overtime</h3>{" "}
            <div className="whitebackground">
              <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={statsData.RMSE}>
                  <CartesianGrid />
                  <XAxis dataKey="name" interval={"preserveStartEnd"} />
                  <YAxis></YAxis>
                  <Legend />
                  <Tooltip />
                  <Line dataKey="Max RMSE" stroke="blue" activeDot={{ r: 8 }} />
                  <Line dataKey="Min RMSE" stroke="red" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h3>New Job Overtime</h3>
            <div className="whitebackground">
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
          <iframe
            src="tableau.html"
            title="tableau"
            frameBorder="0"
            scrolling="no"
          ></iframe>
          {!buttonDisabled && (
            <button
              disabled={buttonDisabled}
              className="redButton"
              onClick={() => handleStartNewCrawl()}
            >
              Start New Crawl
            </button>
          )}
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
        <Header title=" Administrator Page - Review" userName="Admin"></Header>
        <div className="Content">
          <div className="dataTableContainer">
            <DataTable
              columns={[
                {
                  name: "Title",
                  selector: (row) => row.title,
                  width: "260px",
                },
                {
                  name: "Vac.",
                  selector: (row) => row.numberofvacancies,
                  width: "50px",
                },
                {
                  name: "Category",
                  selector: (row) => row.categories,
                  width: "250px",
                },
                {
                  name: "Position Levels",
                  selector: (row) => row.positionlevels,
                  width: "180px",
                },
                {
                  name: "Posted Company",
                  selector: (row) => row.postedcompany,
                  width: "250px",
                },
                {
                  name: "Salary",
                  selector: (row) =>
                    "($" +
                    row.minsalary.toLocaleString() +
                    " - $" +
                    row.maxsalary.toLocaleString() +
                    ")",
                  width: "150px",
                },
                {
                  name: "Remarks",
                  selector: (row) => row.remarks.slice(0, -1),
                  width: "170px",
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
  } else if (window.location.pathname === "/model") {
    return (
      <div className="App">
        <Header title=" Administrator Page - Review" userName="Admin"></Header>
        <div className="Content">
          <div className="dataTableContainer">
            <DataTable
              columns={[
                {
                  name: "ID",
                  selector: (row) => row.id,
                  width: "50px",
                },
                {
                  name: "Created Date",
                  selector: (row) => row.createdDate,
                  width: "260px",
                },
                {
                  name: "Min RMSE",
                  selector: (row) => row.min_rmse.slice(0, -10),
                  width: "100px",
                },
                {
                  name: "Max RMSE",
                  selector: (row) => row.max_rmse.slice(0, -10),
                  width: "100px",
                },
                {
                  name: "Min R²",
                  selector: (row) => row.min_rsquare.slice(0, -13),
                  width: "100px",
                },
                {
                  name: "Max R²",
                  selector: (row) => row.max_rsquare.slice(0, -13),
                  width: "100px",
                },
                {
                  name: "Selected",
                  selector: (row) => (row.selected === "1" ? "Yes" : ""),
                  width: "100px",
                },
              ]}
              data={modelData}
              selectableRows
              onSelectedRowsChange={handleCheckbox2}
            />
            {selectedRows2.length === 1 && (
              <button onClick={() => handleSetModel(selectedRows2)}>
                Use selected Model
              </button>
            )}
          </div>
          <h1>Min Error</h1>
          <span>Y - Predicted, X - Actual</span>
          <img src={getBackendURL() + "/minplot.png"} alt="minplot"></img>
          <h1>Max Error</h1>
          <span>Y - Predicted, X - Actual</span>
          <img src={getBackendURL() + "/maxplot.png"} alt="maxplot"></img>
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
        <Header title="Employer" userName="Test Employer"></Header>
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
              {displaySpinner && (
                <img src="loading_icon.gif" className="spinner" alt="spinner" />
              )}
              <input
                type="number"
                min="0"
                value={minimumSal}
                onChange={(e) => setMinimumSal(e.target.value)}
              ></input>
              <label>Max Salary- ${pMaxSal.toLocaleString()}</label>
              {displaySpinner && (
                <img src="loading_icon.gif" className="spinner" alt="spinner" />
              )}
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
