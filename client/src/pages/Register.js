
import '../assets/styles/global.css';
import '../assets/styles/register.css';
import React, { useState } from 'react';
import useStore from '../store/store';//zustand global thingy
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const setToken = useStore(state => state.setToken);

    const navigate= useNavigate();


    const onSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then(response => {
                if (response.status === 201) {
                    alert("User registered!!")
                    setIsRegistered(true);
                    setUsername(''); // clear username
                    setEmail(''); // clear email
                    setPassword(''); // clear password
                } else {
                    alert(response);
                    return;
                }
            })
            .then(data => {
                if (data) {
                    if (data.includes('duplicate key')) {
                        setErrorMessage('Username or email already in use');
                    }
                    else
                        setErrorMessage(data);
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
    };

    const onLogin = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailLogin, password: passwordLogin }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                    console.log("SEETTTEDD TOKEN!");
                    navigate('/blogs'); //redirect to /blogs page
                } else {
                    setErrorMessage2(data);
                }
            })
            .catch(error => {
                setErrorMessage2(error.message);
            });
    };


    return (
        <div className="registerContent">

            <div id="register">
                <form onSubmit={onSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <input type="submit" value="Register" />
                    <p className="errortext" hidden={!errorMessage}>{errorMessage}</p>
                </form>
            </div>

            <div id="login">
                <form onSubmit={onLogin}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="emailLogin" name="email" placeholder="Email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} />
                    <br />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="passwordLogin" name="password" placeholder="Password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} />
                    <br />
                    <input type="submit" value="Log in" />
                    <p className="errortext" hidden={!errorMessage2}>{errorMessage2}</p>
                </form>
            </div>
        </div>
    )
}

export default Register;