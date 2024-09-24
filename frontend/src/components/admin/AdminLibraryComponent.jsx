import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import GiveUserModal from './modals/GiveUserModal';
import BookModal from './modals/BookModal'
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function AdminLibraryComponent() {

    const navigate = useNavigate();
    
    const [loaded, setLoaded] = useState(false);
    const token = useContext(UserContext);
    const [books, setBooks] = useState([]);

    const [activeGiveModal, setActivateGiveModal] = useState(false);
    const [activeBookModal, setActiveBookModal] = useState(false);
    const [id, setId] = useState(null);


    const getBookList = async () => {
        setLoaded(false);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        };
        const response = await fetch("/allBooks", requestOptions);
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            setBooks(data);
            setLoaded(true);
        }
        setLoaded(true);
    };

    useEffect(() => {
        getBookList();
    }, [])

    const deleteBook = async (id) => {

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            }
        }

        const response = await fetch("/deleteBook/" + id + "", requestOptions);
        const data = await response.json();
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            getBookList();

        }
    };

    const handleModal = async () => {
        setActiveBookModal(!activeBookModal);
        getBookList();
        setId(null);
    };

    const handleGiveUserModal = async (id) => {
        setActivateGiveModal(!activeGiveModal);
        setId(id);
        getBookList();
    };

    const handleUpdate = async (id) => {
        setId(id);
        getBookList();
        setActiveBookModal(true);
    };


    return (
        <div>

            <BookModal
                activeBookModal={activeBookModal}
                handleModal={handleModal}
                token={token}
                id={id}
            >
            </BookModal>
            <GiveUserModal
                activeGiveModal={activeGiveModal}
                handleGiveUserModal={handleGiveUserModal}
                token={token}
                id={id}
            >
            </GiveUserModal>
            <button className="button is-success" onClick={() => setActiveBookModal(true)}>Create Book</button>
            {loaded && books ? (
                <div>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>book name</th>
                                <th>author</th>
                                <th>in librariy</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.book_name}</td>
                                    <td>{book.author}</td>
                                    <td style={{ color: book.is_here ? "green" : "red" }}>
                                        {book.is_here ? "In library" : "Not here"}
                                    </td>
                                    <td>
                                        {book.is_here ? <button className="button mr-2 is-info"
                                            onClick={() => {
                                                handleGiveUserModal(book.id)
                                                setActivateGiveModal(true)
                                            }
                                            }>Give User</button> : ""}
                                        {book.is_here ? <button className="button mr-2 is-success"
                                            onClick={() =>
                                                handleUpdate(book.id)
                                            } >Update</button> : ""}
                                        {book.is_here ? <button className="button mr-2 is-danger"
                                            onClick={() =>
                                                deleteBook(book.id)
                                            }>Delete</button> : ""}
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

export default AdminLibraryComponent