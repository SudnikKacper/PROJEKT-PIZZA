import React, { useEffect, useState } from "react";
import "../App.css";
import {Link} from "react-router-dom";

export default function TEST() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginStatus, setLoginStatus] = useState("");

    const register = () => {
        fetch("http://localhost:9951/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameReg,
                password: passwordReg,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const login = () => {
        fetch("http://localhost:9951/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setLoginStatus(data.message);
                } else {
                    document.cookie = `role=${data[0].rola}+${data[0].id}; path=/`;
                    console.log(data[0].rola);
                    console.log(data[0].id);
                    setLoginStatus(data[0].username);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div className="App">
            <div className="registration">
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
                    type="text"
                    onChange={(e) => {
                        setPasswordReg(e.target.value);
                    }}
                />
                <button onClick={register}> Register </button>
            </div>

            <div className="login">
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
                    <button onClick={login}> Login</button>

            </div>

            <h1>{loginStatus}</h1>
        </div>
    );
}
