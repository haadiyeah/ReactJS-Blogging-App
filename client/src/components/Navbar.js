import React, { useState } from 'react';
import { Link } from "react-router-dom"
import logo from '../assets/images/hyrulegazettelogo.png';
import '../assets/styles/global.css';
import '../assets/styles/notification.css';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/store';
import NotificationMenu from './NotificationMenu';

function Navbar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { token, setToken } = useStore();
    
    let username = '';

    if (token) {
        const decodedToken = jwtDecode(token);
        username = decodedToken.username; // replace 'username' with the actual property name in the token payload
    }


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
                    <Link to="/blogs/" className="nav-link">About</Link>
                        {/* <a className="nav-link" href="#">About</a> */}
                    </li>
                    {token && <li className="nav-item">
                    <Link to="/users/feed" className="nav-link">Feed</Link>
                    </li> }

                </ul>
            </div>
            <div class="buttons">
                {token && <b>Hello, {username} </b>}
                {!token && <button class="btn btn-primary"> <Link className="link" to="/users/register" >Sign up</Link> </button>}
                {!token && <button class="btn btn-secondary"><Link className="link" to="/users/register" >Log in</Link></button>}
                {token && <button class="btn btn-secondary">   <Link className="link" to="/create">➕</Link>  </button> }
                {token && <button id="notifications" class="btn btn-secondary" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>🔔</button>}
                {isNotificationsOpen && (
                 <NotificationMenu isNotificationsOpen={isNotificationsOpen} setIsNotificationsOpen={setIsNotificationsOpen} />
                )}
                {token && <button class="btn btn-secondary"><Link className="link" to="/users/profile" >👤</Link></button> /* notif */}
        
                {token && <button class="btn btn-secondary" id="logoutbtn" onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                        setToken('');
                    }
                }}>Log out</button>}

            </div>
        </nav>

       
    )
    
}
export default Navbar;