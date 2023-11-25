
import '../assets/styles/global.css';
import '../assets/styles/register.css';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/store';//zustand` 
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { token, setToken } = useStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username);
            setEmail(decodedToken.email);
            setRole(decodedToken.role);
        } else {
            return (
                <div>
                    <p class="errortext">An error occurred! You are not signed in correctly</p>
                </div>
            )
        }
    }, [token]);
    const onSubmit = async (event) => {
        event.preventDefault();

        if(password!=password2) {
            setErrorMessage('Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
    
            if (response.ok) {
                alert('User profile updated successfully');
                navigate('/blogs');
            } else {
                setErrorMessage(response.text());
            }
        } catch (error) {
            setErrorMessage('Error updating user profile');
        }
    }


    return (
        <div className="registerContent">
            <div id="register">
                <h3>Edit Profile Details</h3>
                <form onSubmit={onSubmit}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" placeholder="Type new Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <label htmlFor="password2">Password: </label>
                    <input type="password" id="password2" name="password" placeholder="Confirm new Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    <br />
                    <input type="submit" value="Make Changes" />
                    <p className="errortext" hidden={!errorMessage}>{errorMessage}</p>
                </form>
            </div>
        </div>
    )
}

export default Profile;