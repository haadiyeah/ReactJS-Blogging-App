import React from 'react';
import { Route, Routes, Link } from "react-router-dom"
import logo from '../assets/images/hyrulegazettelogo.png';
import '../assets/styles/global.css';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand navbarBrand" href="#"> <img src={logo} class="logo" alt="hyrule-logo" /> Hyrule Gazette</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                    <Link to="/blogs/" className="nav-link">Home</Link>
                        {/* <a className="nav-link" href="#">Home </a> */}
                    </li>
                    <li className="nav-item">
                    <Link to="/blogs/" className="nav-link">Post</Link>
                        {/* <a className="nav-link" href="#">About</a> */}
                    </li>
                    <li className="nav-item">
                    <Link to="/blogs/" className="nav-link">About Us</Link>
                    </li>
                    <li className="nav-item">
                    <Link to="/blogs/" className="nav-link">Profile</Link>
                    </li>
                </ul>
            </div>
            <div class="buttons">
                <button class="btn btn-primary"> <Link className="link" to="/users/register" >Sign up</Link> </button>
                <button class="btn btn-secondary">Log in</button>
            </div>
        </nav>
    )
    
}
export default Navbar;