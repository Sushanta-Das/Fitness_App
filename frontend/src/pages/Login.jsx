import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    return (
        <div className="total-content">
            <h1> Login </h1>
            <div className="box">
                Email: <input type="email" onChange={(e) => { setEmail(e.target.value) }} /> <br /> <br />
                Password: <input type="password" onChange={(e) => { setPassword(e.target.value) }} /> <br /> <br /> <br />

                <button onClick={() => {
                    fetch("http://localhost:3000/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: email,                        
                            password: password
                        }),
                        headers: {
                            "content-type": "application/json"
                        }
                    })
                        .then(async function(res) {
                            const json = await res.json();
                            const todoList = json.todoList;              
                            if (json.validEmailPassword[0] == false) {
                                setMessage("User doesn't exit.");
                            }
                            else {
                                if (json.validEmailPassword[1] == false) {
                                    setMessage("Wrong Password.");
                                }
                                else {
                                    navigate("/login/todo", { state: { todoList, email } });
                                }
                            }
                        })
                }}> Login </button> <br /> <br />

                {message}
            </div>
        </div>
    )
}

export default Login