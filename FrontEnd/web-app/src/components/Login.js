import React, { useState } from "react";
import "../styles/styles.css";
import { register, login } from '../services/API';

export default function Login() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginStatus, setLoginStatus] = useState("");



    const registerUser = () => {
        const userData = {
            username: usernameReg,
            password: passwordReg,
        };

        register(userData)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error during registration:", error);
            });
    };

    const loginUser = () => {
        const loginData = {
            username: username,
            password: password,
        };

        login(loginData)
            .then((data) => {
                if (data.message) {
                    setLoginStatus(data.message);
                } else {
                    document.cookie = `role=${data[0].rola}+${data[0].id}; path=/`;
                    console.log(data[0].rola);
                    console.log(data[0].id);
                    setLoginStatus('Zalogowano');
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
            });
    };

    return (
        <div className="App">
            <div className="registration-card">
                <h1>Registration</h1>
                <label>Username</label>
                <input
                    type="text"
                    onChange={(e) => {
                        setUsernameReg(e.target.value);
                    }}
                />
                <label>Password</label>
                <input
                    type="password"
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }}

                />
                <button onClick={registerUser}> Register </button>
            </div>

            <div className="login-card">
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Username..."
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <input
                    type="password"
                    placeholder="Password..."
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button onClick={loginUser}> Login</button>
            </div>

            <div className={"status-card"}>
                <h1>{loginStatus}</h1>
            </div>
        </div>
    );
}
