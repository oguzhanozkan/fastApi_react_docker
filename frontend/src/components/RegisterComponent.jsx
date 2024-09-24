import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterMessage from "../messages/RegisterMessage";

const RegisterComponent = () => {

    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password }),
        };

        const response = await fetch("/register", requestOptions);
        const data = await response.json();

        if (data.status_code === 201) {
            setMessage(data.detail[0])
            navigate('/login');

        } else if (data.status_code === 409) {
            setMessage(data.detail[0])
            setEmail("")
            setPassword("")
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitRegistration()
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={username}
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
                <RegisterMessage message={message}></RegisterMessage>
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};
export default RegisterComponent;