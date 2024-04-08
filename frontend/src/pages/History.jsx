import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "../App.css";
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
  const [recommendationData, setRecommendationData] = useState(null);
  const [modal, setModal] = useState(false);
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

    fetch("http://localhost:3000/recommendation", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then(async function (res) {
      const recommendationData = await res.json();
      setRecommendationData(recommendationData);
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

  const openModal = () => {
    // Implement your modal logic here
    if (modal) setModal(false);
    else setModal(true);
    console.log(recommendationData);
  };
  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="total-content">
      <h1> Activities </h1>
      <div
        className="box activityBox"
        style={{ display: "flex", flexDirection: "column", gap: "10vh" }}
      >
        <div className="chart" style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: "31vw", height: "38vh" }}>
            <h2>Daily Steps</h2>
            <Line data={stepsData} />
          </div>
          <div style={{ width: "31vw", height: "38vh", padding: "0" }}>
            <h2>Sleep Duration</h2>
            <Line data={sleepDurationData} />
          </div>
          <div style={{ width: "31vw", height: "38vh" }}>
            <h2>Exercise Completion (%)</h2>
            <Line data={exerciseCompletionData} />
          </div>
        </div>
        <div>
          {" "}
          <button className="btn" onClick={openModal}>
            Guidance
          </button>
        </div>
      </div>

      {modal && (
        <div className="Modal">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "2vw",
            }}
          >
            <div style={{ fontSize: "2em", fontWeight: "bold" }}>Guidance</div>
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>

          <div className="recommendation-data">
            <div>
              <h3>User Information</h3>
              <p>Email: {recommendationData.user.email}</p>
              <p>Name: {recommendationData.user.name}</p>
              <p>Gender: {recommendationData.user.gender}</p>
              <p>Age: {recommendationData.user.age}</p>
              <p>Height: {recommendationData.user.height}</p>
              <p>Weight: {recommendationData.user.weight}</p>
              <p>Current State: {recommendationData.user.currentState}</p>
              {/* <p>Cosistency: {recommendationData.consistency}</p> */}
              <div>
              <h3>Your Todays Steps</h3>
              <div style={{ "font-size": "2em", "font-weight": "bold" }}>
                {history[history.length - 1].steps}
              </div>
            </div>
            </div>
            <div>
              <h3>Recommendation</h3>
              <p>BMR: {recommendationData.recommendation.BMR}</p>
              <p>
                Minimum Calories:{" "}
                {recommendationData.recommendation.minimum_calories}
              </p>
              <p>
                Recommended Calories:{" "}
                {recommendationData.recommendation.recommended_calories}
              </p>
              <p>
                Protein Required:{" "}
                {recommendationData.recommendation.protein_required}
              </p>
              <p>
                Fat Required: {recommendationData.recommendation.fat_required}
              </p>
              <p>
                Carbs Required:{" "}
                {recommendationData.recommendation.carbs_required}
              </p>
              <p>
                Sleep Recommended:{" "}
                {recommendationData.recommendation.sleep_recommeded}
              </p>
              <div>
              <h3>Consistency Rating</h3>
              <div style={{ "font-size": "2em", "font-weight": "bold" }}>
                {recommendationData.consistency}
              </div>
            </div>
            </div>
            
          </div>
          {/* <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <h3>Todays Steps</h3>
              <div style={{ "font-size": "2em", "font-weight": "bold" }}>
                {history[history.length - 1].steps}
              </div>
            </div>

          </div> */}
        </div>
      )}
    </div>
  );
}

export default History;
