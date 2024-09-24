import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { UserInfoContext } from '../../context/UserInfoContext';
import Swal from 'sweetalert2';
import UserModal from './modals/UserModal';
import { useNavigate } from "react-router-dom";

function UsersComponent() {

    const navigate = useNavigate();

    const [, setUsernameContext] = useContext(UserInfoContext);
    const [loaded, setLoaded] = useState(false);

    const token = useContext(UserContext);
    const [showUserList, setShowUserList] = useState(false);
    const [users, setUsers] = useState([]);

    const [activeUserModal, setActiveUserModal] = useState(false);
    const [id, setId] = useState(null);

    let i = 0

    const getUserList = async () => {
        setLoaded(false);
        setShowUserList(true);

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
        };
        const response = await fetch("/allusers", requestOptions);

        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            setShowUserList(true)
            setUsers(data);
            setLoaded(true);
        }
        setLoaded(true);
    };

    useEffect(() => {
        getUserList();
    }, [])

    const handleUserModal = async () => {
        setActiveUserModal(!activeUserModal)
        getUserList();
        setId(null)
    };

    const handleUpdateUser = async (id) => {
        setId(id);
        getUserList();
        setActiveUserModal(true);
    };


    const deleteUser = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        }

        const response = await fetch("/deleteUser/" + id + "", requestOptions);
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            Swal.fire("deleted success");
            getUserList();
            setShowUserList(true);
        }
    };

    const handleInfoUser = async (userId) => {
        setUsernameContext(userId);
        navigate('/userInfo');
    }

    return (
        <div>

            <UserModal
                activeUserModal={activeUserModal}
                handleUserModal={handleUserModal}
                token={token}
                id={id}
            >
            </UserModal>


            {showUserList ? (
                loaded && users ? (
                    <div>
                        <button className="button is-success" onClick={() => setActiveUserModal(true)}>Create User</button>
                        <table className="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Is active</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key= {i++}>
                                        <td>{user.username}</td>
                                        <td>{user.is_active ? "active" : "not active"}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button className="button mr-2 is-info"
                                                onClick={() =>
                                                    handleInfoUser(user.id)
                                                }>User Info</button>
                                            <button className="button mr-2 is-success"
                                                onClick={() =>
                                                    handleUpdateUser(user.id)
                                                }>User Update</button>
                                            <button className="button mr-2 is-danger"
                                                onClick={() =>
                                                    deleteUser(user.id)}>Delete User</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) :
                    (<p>Loading...</p>)
            ) : null}

        </div>
    )
}

export default UsersComponent
