import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const GiveUserModal = ({ activeGiveModal, handleGiveUserModal, token, id }) => {

  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState(null);

  const listAllUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token[0],
      },
    };
    const response = await fetch("/allusers", requestOptions);
    const data = await response.json();

    if (response.status === 401) {
      localStorage.clear()
      Swal.fire("your token is expire")
      navigate('/login')
    } else {
      setUsers(data);
      setLoaded(true);
    }
  }

  useEffect(() => {
    listAllUser();
  }, [])


  const giveUser = async (user_id) => {

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token[0],
      },
      body: JSON.stringify({ book_id: id, user_id: user_id }),
    };

    const response = await fetch("/bookGiveUser", requestOptions);

    if (response.status === 401) {
      localStorage.clear()
      Swal.fire("your token is expire")
      navigate('/login')
    } else {
      const data = await response.json();
      Swal.fire(data.detail[0]);
      handleGiveUserModal();
    }
  }

  return (
    <div>
      <div className={`modal ${activeGiveModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={handleGiveUserModal}></div>
        <div className="modal-card is-large">
          <section className="modal-card-body">
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Active</th>
                  <th>Role</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {loaded ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.is_active ? "Yes" : "No"}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="button is-primary" onClick={() => giveUser(user.id)}>
                          Give Book
                        </button>
                      </td>
                      <td>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Loading users...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  )
}

export default GiveUserModal