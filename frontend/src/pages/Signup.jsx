import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container">
      <div className="form">
        <div>
          <label>Email: </label>
          <input
            type="email"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Name: </label>
          <input
            type="text"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Gender: </label>
          <input
            list="gender"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          />
          <datalist id="gender">
            <option value="Female" />
            <option value="Male" />
            <option value="Other" />
          </datalist>
        </div>

        <div>
          <label>Age (in years): </label>
          <input
            type="number"
            step="0.1"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setAge(e.target.value);
            }}
          />
        </div>

        <div>
          {" "}
          <label>Height (in feet): </label>
          <input
            type="number"
            step="0.1"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setHeight(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Weight (in kg): </label>
          <input
            type="number"
            step="0.1"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setWeight(e.target.value);
            }}
          />
        </div>
        <div>
          {" "}
          <label>Current State: </label>
          <input
            list="state"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setCurrentState(e.target.value);
            }}
          />
          <datalist id="state">
            <option value="Beginner" />
            <option value="Intermediate" />
            <option value="Advanced" />
          </datalist>
        </div>
        <div>
          {" "}
          <label>Password: </label>
          <input
            type="password"
            style={{ marginBottom: "4px", padding: "5px" }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button
          className="btn"
          onClick={() => {
            fetch("http://localhost:3000/signup", {
              method: "POST",
              body: JSON.stringify({
                email: email,
                name: name,
                gender: gender,
                age: age,
                height: height,
                weight: weight,
                currentState: currentState,
                password: password,
              }),
              headers: {
                "content-type": "application/json",
              },
            }).then(async function (res) {
              const exerciseList = await res.json();
              navigate("/signup/level", { state: { exerciseList, email } });
            });
          }}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;
