import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// setting up plot
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "AWS Instance CPU usage",
    },
  },
};

function App() {
  //fetching data
  const [dataAPI, setDataAPI] = useState([]);

  const [period, setPeriod] = useState(3600);
  const [timePeriod, setTimePeriod] = useState(86400000);
  const [privateIP, setPrivateIP] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");

  //dependency for useEffect, toggle when load is clicked
  const [load, setLoad] = useState(false);

  // form input handlers
  const handleChangePeriod = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = target.value;
    setPeriod(target.value);
  };

  const handleChangeTimePeriod = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = target.value;
    setTimePeriod(target.value);
  };

  const handleLoad = (e) => {
    e.preventDefault();
    setLoad(!load);
  };

  const handleChangeprivateIP = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = target.value;
    setPrivateIP(target.value);
  };

  let url = `http://localhost:3300/api/metrics?privateIP=${privateIP}&timePeriod=${timePeriod}&period=${period}`;

  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        let response = await fetch(url);
        response = await response.json();
        //Set blank error msg
        setErrorMsg("");

        let correctTimestamp;
        // sort data by timestamp
        const sortedData = response.Datapoints.sort(function (a, b) {
          let aDate = new Date(a["Timestamp"]);
          let bDate = new Date(b["Timestamp"]);
          return aDate - bDate;
        });

        // create array from provided data with correct formating for plots
        setDataAPI(
          sortedData.map((item) => {
            correctTimestamp = new Date(item["Timestamp"]).toGMTString();

            return {
              x: correctTimestamp,
              y: item["Average"],
            };
          })
        );
      } catch (error) {
        console.log(error, "Please, provide correct parameters!");
        setErrorMsg("Please, provide correct parameters.");
      }
    };

    fetchDataAPI();
  }, [load]);

  const data = {
    labels: [],
    datasets: [
      {
        label: "Metric Data",
        data: dataAPI,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="container">
      <form>
        <label htmlFor="timePeriod">Choose time period: </label>
        <select
          name="timePeriod"
          id="timePeriod"
          onChange={handleChangeTimePeriod}
        >
          <option value="86400000">Last day</option>
          <option value="604800000">Last week</option>
          <option value="2628000000">Last 30 days</option>
          <option value="15770000000">Last 6 month</option>
          <option value="31540000000">Last year</option>
        </select>
        <br />
        <label htmlFor="period">Choose period in seconds: </label>
        <input
          type="number"
          id="period"
          name="period"
          onChange={handleChangePeriod}
        />
        <br />
        <label htmlFor="privateIP">Private IP: </label>
        <input
          type="text"
          id="privateIP"
          name="privateIP"
          onChange={handleChangeprivateIP}
        />
        <br />
        <input type="submit" value="Load" onClick={handleLoad} />
      </form>
      <p>{errorMsg}</p>
      <Line options={options} data={data} />
    </div>
  );
}

export default App;
