import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Level() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [targetLevel, setTargetLevel] = useState("");
  const [selectedExerciseList, setSelectedExerciseList] = useState([]);

  const email = state.email;

  function handleOnChange(isChecked, item) {
    if (isChecked) {
      setSelectedExerciseList([...selectedExerciseList, item]); // appends 'item' to 'selectedExerciseList' array
    } else {
      setSelectedExerciseList([
        ...selectedExerciseList.filter((e) => e !== item),
      ]); // removes 'item' from 'selectedExerciseList' array
    }
  }

  return (
    <div>
      Choose your preferred exercises: <br />
      {state.exerciseList.map((item) => {
        return (
          <div>
            <input
              type="checkbox"
              onChange={(e) => handleOnChange(e.target.checked, item)}
            />{" "}
            {item}
          </div>
        );
      })}
      <button
        onClick={() => {
          fetch("http://localhost:3000/level", {
            method: "POST",
            body: JSON.stringify({
              targetLevel: targetLevel,
              selectedExerciseList: selectedExerciseList,
              email: email,
            }),
            headers: {
              "content-type": "application/json",
            },
          }).then(async function (res) {
            const todoList = await res.json();
            navigate("/signup/level/todo", { state: { todoList, email } });
          });
        }}
      >
        {" "}
        Submit{" "}
      </button>
    </div>
  );
}

export default Level;
