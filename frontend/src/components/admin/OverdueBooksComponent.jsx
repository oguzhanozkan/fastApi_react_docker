import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function OverdueBooksComponent() {

    const navigate = useNavigate();
    
    const token = useContext(UserContext);
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [loaded, setLoaded] = useState(false);

    let i = 0

    const getAllOverdueBooks = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
        };
        const response = await fetch("/overduebooks", requestOptions);

        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            if (data['overdue_books'].length > 0) {
                setOverdueBooks(data['overdue_books'])
                setLoaded(true)
                
            } else {
                Swal.fire("books have got a time for return");
                setLoaded(false)
            }
        }
    };



    useEffect(() => {
        getAllOverdueBooks();
    }, [])


    return (
        <div>
            <div>
                {loaded ? (
                    <table className='table is-fullwitdh'>
                        <thead>
                            <tr>
                                <th>book name</th>
                                <th>author</th>
                                <th>will return date</th>
                                <th>username</th>
                            </tr>
                        </thead>
                        <tbody>
                            { overdueBooks.map((book) => (
                                <tr key={i++}>
                                    <td>{book.book_name}</td>
                                    <td>{book.author}</td>
                                    <td>{book.will_return_date}</td>
                                    <td>{book.user_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>Loading</p>)}
            </div>
        </div>
    )
}

export default OverdueBooksComponent
