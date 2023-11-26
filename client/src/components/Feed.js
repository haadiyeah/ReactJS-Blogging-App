import '../assets/styles/blogfeed.css';  //import css file
import '../assets/styles/global.css';
import BlogFeed from '../components/BlogFeed';
import React, { useState, useEffect } from 'react';
import useStore from '../store/store'; //zustand` 
///document.getElementById("textbox").value

function Feed() {
  const [blogs, setBlogs] = React.useState([]);
  const [error, setError] = useState(null);
  const { token, setToken } = useStore();

  useEffect(() => {
    if (token) {
        fetch(`http://localhost:3000/interaction/feed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        })
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then(data => { setBlogs(data);  })
      .catch(error => {
        console.error('Fetch error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        setError(error);
      });
    } else {
        return (
            <div>
                <p class="errortext">An error occurred! You are not signed in correctly</p>
            </div>
        )
    }
}, [token]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="feed">
        <h1>Your Feed</h1>
        { blogs.length==0 ? <p>No blogs are in your feed just yet. Try following some bloggers first!</p> :
        <BlogFeed blogs={blogs} /> }
    </div>
  )

}

export default Feed;

