import React, { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";


const BookModal = ({ activeBookModal, handleModal, token, id }) => {

    const navigate = useNavigate();
    const [bookname, setBookname] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");

    const cleanFormData = () => {
        setBookname("");
        setBookAuthor("");
    };

    const handleCreateBook = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ book_name: bookname, author: bookAuthor }),
        };

        const response = await fetch("/createBook", requestOptions);
        if(response.status === 401){
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        }else {
            const data = await response.json();
            Swal.fire(data.detail[0]);
            cleanFormData();
            handleModal();
        }

    }

    const handleUpdateBook = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token[0],
            },
            body: JSON.stringify({ book_name: bookname, author: bookAuthor }),
        };

        const response = await fetch("/updateBook/" + id + "", requestOptions);
        
        if (response.status === 401) {
            localStorage.clear()
            Swal.fire("your token is expire")
            navigate('/login')
        } else {
            const data = await response.json();
            Swal.fire(data.detail);
            cleanFormData();
            handleModal();
        }
    }

    return (

        <div className={`modal ${activeBookModal && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {id ? "update" : "create"}
                    </h1>
                    <section className="modal-card-body">
                        <form>
                            <div className="field">
                                <label className="label">Book Name</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        placeholder="Enter book name"
                                        value={bookname}
                                        onChange={(e) => setBookname(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Author</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        placeholder="Enter Author"
                                        value={bookAuthor}
                                        onChange={(e) => setBookAuthor(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        {id ? (
                            <button className="button is-info"
                                onClick={handleUpdateBook}>
                                Update
                            </button>
                        ) : (
                            <button className="button is-primary"
                                onClick={handleCreateBook}>
                                Create
                            </button>
                        )}
                        <button className="button" onClick={handleModal}>
                            Cancel
                        </button>
                    </footer>
                </header>
            </div>
        </div>
    );

};

export default BookModal;