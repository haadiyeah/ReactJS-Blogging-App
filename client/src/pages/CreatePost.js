import '../assets/styles/global.css';
import '../assets/styles/addblog.css';
import React, { useEffect, useState } from 'react';
import useStore from '../store/store'; //zustand 
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [image, setimage] = useState('');
    const [blurb, setBlurb] = useState('');
    const [content, setContent] = useState('');
    const { token, setToken } = useStore(); //getting token
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!token) {
    //         alert("You were logged out. Please log back in.")
    //         navigate(-1);
    //     }
    // }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
    
        const response = await fetch('http://localhost:3000/blogs/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({ title, image, blurb, content }),
        });
    
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            setTitle('');
            setimage('');
            setBlurb('');
            setContent('');
            navigate(`/blogs/${data.id}`);
        } else {
            const errorMessage = response.message;
            setErrorMessage(errorMessage);
        }
    };

    const generatePrompt = async (e) => {
        e.preventDefault();
        const categories = ["characters", "games", "places", "bosses"];
    
        const fetchString= `https://zelda.fanapis.com/api/${categories[Math.floor(Math.random() * categories.length)]}?limit=30`;
    
        const response = await fetch(fetchString, {
            method: 'GET',
        });
    
        let data = await response.json();
        data=data.data;
        let generatedContent = "";
    
        if (response.ok) {
            const randId=Math.floor(Math.random() * data.length);
            generatedContent += data[randId].name + "\n";
            generatedContent += data[randId].description;
        }
    
        setContent(generatedContent);
    };

    return (
        <div className="registerContent">
            <div id="register">
                <h5>Create post</h5>
                <hr></hr>
                <form onSubmit={onSubmit} id="createPostForm">
                    <label htmlFor="title">Post Title</label>
                    <input type="text" id="title" name="title" placeholder="Enter blog post title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                    <br />
                    <label htmlFor="image">Header Image URL</label>
                    <input type="text" id="image" name="image" placeholder="Enter valid URL to your header image..." value={image} onChange={(e) => setimage(e.target.value)} />
                    <br />
                    <label htmlFor="blurb">Blurb</label>
                    <input type="text" id="blurb" name="blurb" placeholder="Enter blurb (optional) - max 90 characters" value={blurb} onChange={(e) => setBlurb(e.target.value)} />
                    <br />
                    <label htmlFor="content">Content</label>
                    <br></br>
                    <button onClick={generatePrompt} className="btn btn-secondary generatePrompt">💡 Generate Prompt</button>
                    <textarea id="content" name="content" placeholder="Type your blog post here..." cols="80" rows="10" value={content} onChange={(e) => setContent(e.target.value)} />
                    <input type="submit" value="Make " />
                    <p className="errortext" hidden={!errorMessage}>{errorMessage}</p>
                </form>
            </div>
        </div>
    )
}

export default CreatePost;