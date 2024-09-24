import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { UserInfoContext } from '../../context/UserInfoContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function UserLibraryComponent() {

    const navigate = useNavigate();

    const token = useContext(UserContext);
    const user_id = useContext(UserInfoContext)

    const [books, setBooks] = useState([]);
    const [loaded, setLoaded] = useState(false);


    const getBookList = async () => {
        setLoaded(false);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        };

        const response = await fetch("/availableBooks", requestOptions);
        if(response.status === 401){
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();

            if (data['books'].length > 0) {
                setBooks(data['books']);
                setLoaded(true);
            } else {
                Swal.fire("No book in library")
                navigate('/');
            }

        }
    };

    useEffect(() => {
        getBookList();
    }, [])


    const takeBook = async (id) => {

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ book_id: id, user_id: user_id[0] }),
        };

        const response = await fetch("/takeBook", requestOptions);

        if(response.status === 401){
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            getBookList();
        }
    }


    return (
        <div>
            {loaded && books ? (
                <div>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>book name</th>
                                <th>author</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.book_name}</td>
                                    <td>{book.author}</td>
                                    <td>
                                        <button className="button is-success" onClick={() =>
                                            takeBook(book.id)
                                        }>Take</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p></p>
            )
            }
        </div>
    )
}

export default UserLibraryComponent
