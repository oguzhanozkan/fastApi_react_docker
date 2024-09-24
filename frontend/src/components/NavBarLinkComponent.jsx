import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { jwtDecode } from "jwt-decode"

function NavBarLinkComponent() {


    let username = "";
    let role = "";

    const token = useContext(UserContext);


    if (token[0] == null) {
        username = ""
    } else {
        const token_decode = jwtDecode(token[0])
        username = token_decode.sub.split("@")[0];
        role = token_decode["role"]
    }
    return (
        <div>
            {
                username ? (
                    <div>
                        <p className="navbar-item">
                            Welcome, {username}
                        </p>
                        {
                            role == "USER" ? (
                                <div>
                                    <div>
                                        <div className='button is-light'>
                                            <Link to="/">Home</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/userlibrary">library</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/user">my books</Link>
                                        </div>
                                    </div>
                                </div>
                            ) : role == "ADMIN" ? (
                                <div>
                                    <div>
                                        <div className='button is-light'>
                                            <Link to="/">Home</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/adminlibrary">library</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/users">users</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/overduebooks">overdue books</Link>
                                        </div>
                                        <div className='button is-light'>
                                            <Link to="/user">my books</Link>
                                        </div>
                                    </div>
                                </div>
                            ) : ""
                        }
                    </div>
                ) : ""
            }
        </div>
    )
}

export default NavBarLinkComponent