import '../assets/styles/global.css';
import '../assets/styles/register.css';
import React, { useEffect, useState } from 'react';
const jwtDecode = require('jwt-decode').default; //changed for ts, idk this works...
import useStore from '../store/store'; // Assuming useStore is already a TypeScript module
import { useNavigate } from 'react-router-dom';
import BlogFeed from './BlogFeed';

interface DecodedToken {
    username: string;
    email: string;
    role: string;
    id: string;
}

interface BlogType {
    _id: string;
    id: string;
    image?: string;
    createdAt: string;
    title: string;
    averageRating: number;
    blurb?: string;
    content: string;
    owner: string;
  }

function Profile() {
    const { token, setToken } = useStore();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [id, setid] = useState<string>('');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token); // Type assertion
            setUsername(decodedToken.username);
            setEmail(decodedToken.email);
            setRole(decodedToken.role);
            setid(decodedToken.id);
        } else {
           console.log("An error occurred"); //removed jsx from here as ts doesnt support jsx in useEffect
        }
    }, [token]);

    const [blogs, setBlogs] = useState<BlogType[]>([]);
    useEffect(() => {
        fetch(`http://localhost:3000/blogs/by/me`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then((data: BlogType[]) => {
            setBlogs(data);
        }).catch(error => console.error('Error:', error));
    }, [blogs]);


    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
                setErrorMessage("an error occurred");
            }
        } catch (error) {
            setErrorMessage('Error updating user profile');
        }
    }


    return (
        <div className="registerContent profileContainer">
            <div id="profileEditor" >
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
            <div id="yourBlogPosts">
                <h3>Your Blog Posts</h3>
                <BlogFeed blogs={blogs} flag={true} />
            </div>
        </div>
    )
}

export default Profile;