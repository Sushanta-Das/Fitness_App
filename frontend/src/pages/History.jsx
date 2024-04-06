import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [history, setHistory] = useState([]);
  const email = state.email;
  //   const history = state.history;

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
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th> Date </th>
            <th> Calorie Burnt </th>
            <th> Step Count </th>
            <th> Sleep Duration </th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => {
            const dateTime = String(item.date);
            const date = dateTime.split("T");

            const sleepDuration = Math.round(item.sleepDurationMinutes);
            const sleepDurationHr = Math.floor(sleepDuration / 60);
            const sleepDurationMin = sleepDuration % 60;

            return (
              <tr key={item.id}>
                <td> {date[0]} </td>
                <td> {item.calorieBurnt} </td>
                <td> {item.steps}</td>
                <td>
                  {" "}
                  {sleepDurationHr} hr {sleepDurationMin} mins{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default History;
