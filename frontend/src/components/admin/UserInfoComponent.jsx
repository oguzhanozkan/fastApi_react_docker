import React, { useContext, useState, useEffect } from 'react'
import { UserInfoContext } from '../../context/UserInfoContext';
import { UserContext } from '../../context/UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
function UserInfoComponent() {

    const navigate = useNavigate();

    const userId = useContext(UserInfoContext);
    const token = useContext(UserContext);
    const [loaded, setLoaded] = useState(false);
    const [userBooks, setUserBooks] = useState([]);


    const [showUserBooks, setShowUserBooks] = useState(false);
    const [showDelayBooks, setShowDelayBooks] = useState(false);


    let i = 0

    const getUserBooks = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        };
        const response = await fetch("/getUserBooks/" + userId[0] + "", requestOptions);
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            if (data['books'].length > 0) {
                setLoaded(true);
                setUserBooks(data['books']);

                setShowUserBooks(true);
                setShowDelayBooks(false);

            } else {
                Swal.fire("user have no any book");
                navigate('/');
            }
        }
    }

    useEffect(() => {
        getUserBooks();
    }, [])

    const getsUserDelay = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        };

        const response = await fetch("/getDelayBooks/" + userId[0] + "", requestOptions);

        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();

            if (data['books'].length > 0) {
                setLoaded(true);
                setUserBooks(data['books']);

                setShowUserBooks(false);
                setShowDelayBooks(true);

            } else {
                Swal.fire("user have no any delay books");
                navigate('/');
            }
        }

    }

    return (
        <div>
            <div className="buttons">
                <button className="button is-danger" onClick={() => getsUserDelay()}>Delay Books</button>
            </div>
            <div>
                {loaded ? (
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Book Name</th>
                                <th>Author</th>
                                <th>in_library</th>
                                <th>Return Date</th>
                                <th>Will Return Date</th>
                                <th>user_name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userBooks.map((book) => (
                                <tr key={i++}>
                                    <td>{book.book_name}</td>
                                    <td>{book.author}</td>
                                    <td>{book.in_library ? "Yes" : "No"}</td>
                                    <td>{book.return_date}</td>
                                    <td>{book.will_return_date}</td>
                                    <td>{book.user_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>Loading...</p>)}
            </div>
        </div>
    )
}

export default UserInfoComponent
