import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1> Wecome to Fitness WebApp </h1>
      <div className="form">
        <div>
          New to this webapp? <br /> Please create an account.<br/><br/>
          <button className="btn" onClick={() => navigate("/signup")}>
            {" "}
            Signup{" "}
          </button>{" "}
        </div>
        <br />
        <div>
          {" "}
          Already have an account? Then login. <br /> <br />
          <button className="btn" onClick={() => navigate("/login")}>
            {" "}
            Login{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
