import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const UserModal = ({ activeUserModal, handleUserModal, token, id }) => {

    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const cleanFormData = () => {
        setUsername("");
        setPassword("");
        setRole("");
    };

    const handleCreateUser = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ username: username, password: password, role: role }),
        };

        const response = await fetch("/adminAccessCreateUser", requestOptions);

        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            Swal.fire("User created")
            cleanFormData();
            handleUserModal();
        }

    }

    const handleUpdateUser = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ username: username, password: password, role: role }),
        };

        const response = await fetch("/updateUser/" + id + "", requestOptions);

        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            cleanFormData();
            handleUserModal();
        }
    }

    return (
        <div className={`modal ${activeUserModal && "is-active"}`}>
            <div className="modal-background" onClick={handleUserModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {id ? "update" : "create"}
                    </h1>
                    <section className="modal-card-body">
                        <form>
                            <div className="field">
                                <label className="label">Username</label>
                                <div className="control">
                                    <input
                                        type="email"
                                        placeholder="Enter user name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Role</label>
                                <div className="control">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="ADMIN"
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                            checked={role === "ADMIN"}
                                        />
                                        Admin
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="USER"
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                            checked={role === "USER"} />
                                        User
                                    </label>
                                </div>
                            </div>

                        </form>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        {id ? (
                            <button className="button is-info"
                                onClick={handleUpdateUser}>
                                Update User
                            </button>
                        ) : (
                            <button className="button is-primary"
                                onClick={handleCreateUser}>
                                Create User
                            </button>
                        )}
                        <button className="button" onClick={handleUserModal}>
                            Cancel
                        </button>
                    </footer>
                </header>
            </div>
        </div>
    )
}

export default UserModal