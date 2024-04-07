import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

function History() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [history, setHistory] = useState([]);
  const email = state.email;

  useEffect(() => {
    fetch("http://localhost:3000/history", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then(async function (res) {
      const history = await res.json();
      setHistory(history);
    });
  }, []);

  // Prepare data for line charts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const stepsData = {
    labels: history.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Steps",
        data: history.map((item) => item.steps),
        fill: false,
        borderColor: "red",
      },
    ],
  };

  const sleepDurationData = {
    labels: history.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Sleep Duration",
        data: history.map((item) => {
          const hours = Math.round(item.sleepDurationMinutes / 60);
          return hours;
        }),
        fill: false,
        borderColor: "blue",
      },
    ],
    options: {
      scales: {
        y: {
          ticks: {
            min: 0,
            max: 14,
            stepSize: 2, // Set the step size to 2 if you want intervals of 2 hours
            callback: function (value) {
              return value + " hr";
            },
          },
        },
      },
    },
  };
  const exerciseCompletionData = {
    labels: history.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Exercise Completion",
        data: history.map((item) => item.exerciseCompleted),
        fill: false,
        borderColor: "green",
      },
    ],
  };

  return (
    <div>
      <div style={{ width: "40vw" }}>
        <h2>Daily Steps</h2>
        <Line data={stepsData} />
      </div>
      <div style={{ width: "40vw" }}>
        <h2>Sleep Duration</h2>
        <Line data={sleepDurationData} />
      </div>
      <div style={{ width: "40vw" }}>
        <h2>Exercise Completion</h2>
        <Line data={exerciseCompletionData} />
      </div>
    </div>
  );
}

export default History;
