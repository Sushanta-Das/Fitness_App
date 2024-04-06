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
    <div>
      Email:{" "}
      <input
        type="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />{" "}
      <br />
      Name:{" "}
      <input
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />{" "}
      <br />
      Gender:{" "}
      <input
        list="gender"
        onChange={(e) => {
          setGender(e.target.value);
        }}
      />
      <datalist id="gender">
        <option value="Female" />
        <option value="Male" />
        <option value="Other" />
      </datalist>{" "}
      <br />
      Age (in years):{" "}
      <input
        type="number"
        step="0.1"
        onChange={(e) => {
          setAge(e.target.value);
        }}
      />{" "}
      <br />
      Height (in feet):{" "}
      <input
        type="number"
        step="0.1"
        onChange={(e) => {
          setHeight(e.target.value);
        }}
      />{" "}
      <br />
      Weight (in kg):{" "}
      <input
        type="number"
        step="0.1"
        onChange={(e) => {
          setWeight(e.target.value);
        }}
      />{" "}
      <br />
      Current State:{" "}
      <input
        list="state"
        onChange={(e) => {
          setCurrentState(e.target.value);
        }}
      />
      <datalist id="state">
        <option value="Beginner" />
        <option value="Intermediate" />
        <option value="Advanced" />
      </datalist>{" "}
      <br />
      Password:{" "}
      <input
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />{" "}
      <br />
      <button
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
        {" "}
        Signup{" "}
      </button>
    </div>
  );
}

export default Signup;
