import React from 'react'
import { Link } from 'react-router-dom'
import NavBarLinkComponent from '../components/NavBarLinkComponent'

function Navbar() {


    return (
        <div>
            <nav className="breadcrumb is-centered" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-brand">
                        <Link to="/">Library App</Link>
                    </div>
                </div>
                <div id="navbarBasicExample" className="navbar-menu">
                <NavBarLinkComponent/>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button className="button is-primary">
                                    <strong><Link to="/register">Register</Link></strong>
                                </button>
                                <button className="button is-light"><Link to="/login">Log in</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar