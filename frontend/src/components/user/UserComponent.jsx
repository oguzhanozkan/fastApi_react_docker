import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";

function UserComponent() {

    const navigate = useNavigate();

    const token = useContext(UserContext);
    const [loaded, setLoaded] = useState(false);
    const [books, setBooks] = useState([]);

    const token_decode = jwtDecode(token[0])
    const username = token_decode.sub;

    const getMyBooks = async () => {
        setLoaded(false);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ username: username }),
        };
        const response = await fetch("/myBooks", requestOptions);
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            if (data['getMyBookResults'].length > 0) {
                setLoaded(true);
                setBooks(data['getMyBookResults']);
            } else {
                Swal.fire("you have not any book")
                navigate('/');
            }
        }
    };

    useEffect(() => {
        getMyBooks();
    }, [])

    const returnBackBook = async (book) => {

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({
                username: book.username,
                book_name: book.book_name,
                author: book.author,
                return_date: new Date(),
                will_return_date: book.will_return_date,
                user_book_is_returned: book.user_book_is_returned

            }),
        };
        const response = await fetch("/returnBack", requestOptions);
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            setLoaded(true);
            getMyBooks();
        }
    };

    return (
        <div>
            <div>
                {loaded && books ? (
                    <div>
                        <table className="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>user name</th>
                                    <th>book name</th>
                                    <th>author</th>
                                    <th>return date</th>
                                    <th>will return date</th>
                                    <th>book is returned</th>
                                    <th>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr >
                                        <td>{book.username}</td>
                                        <td>{book.book_name}</td>
                                        <td>{book.author}</td>
                                        <td>{book.return_date}</td>
                                        <td>{book.will_return_date}</td>
                                        <td>{book.user_book_is_returned ? "yes" : "no"}</td>
                                        <td>
                                            {!book.user_book_is_returned ? <button className="button is-warning"
                                                onClick={() =>
                                                    returnBackBook(book)
                                                }>Return Back</button> : ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>select...</p>
                )
                }
            </div>

        </div>
    )
}

export default UserComponent