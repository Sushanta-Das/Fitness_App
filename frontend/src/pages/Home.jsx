import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    
    return (    
        <div className="total-content">    
            <h1> Wecome to Fitness WebApp </h1>
            <div>                
                <div className="box">
                    New to this webapp? <br /> Please create an account. <br /> <br />
                    <button className="" onClick={() => navigate("/signup")}> Signup </button> <br /> <br /> <br />
                    
                    Already have an account? Then login. <br /> <br />
                    <button className="" onClick={() => navigate("/login")}> Login </button>
                </div>       
            </div>
        </div>
    )
}

export default Home