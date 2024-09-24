import React, { useState, useContext } from "react";
import LoginMessage from "../messages/LoginMessage";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { UserInfoContext } from "../context/UserInfoContext";

const LoginComponent = () => {

    const [, setToken] = useContext(UserContext);
    const [, setUserId] = useContext(UserInfoContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(
                `grant_type=password&username=${email}&password=${password}&scope=&client_id=string&client_secret=string`
            ),
        };

        const response = await fetch("/login", requestOptions);
        const data = await response.json();

        if (data.status_code === 400) {
            setMessage(data.detail[0])
            setEmail("")
            setPassword("")
        } else if (data.status_code === 401) {
            setMessage(data.detail[0])
            setEmail("")
            setPassword("")
        } else if (data.status_code === 406) {
            setMessage(data.detail[0])
            setEmail("")
            setPassword("")
        } else {
            setEmail("")
            setPassword("")
            localStorage.setItem("libraryToken", data.access_token)
            setToken(data.access_token);

            localStorage.setItem("userId", data.id)
            setUserId(data.id)

            navigate('/')
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin()
    };
    
    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Login</h1>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <LoginMessage message={message}></LoginMessage>
                <br />
                <button className="button is-primary" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginComponent