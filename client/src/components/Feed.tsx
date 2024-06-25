import '../assets/styles/blogfeed.css';  //import css file
import '../assets/styles/global.css';
import BlogFeed from './BlogFeed';
import React, { useState, useEffect } from 'react';
import useStore from '../store/store'; //zustand` 
///document.getElementById("textbox").value

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




function Feed() {
  const [blogs, setBlogs] = React.useState<BlogType[]>([]);
  const [error, setError] = useState<Error | string | null>(null);
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
      .then(data => { setBlogs(data); })
      .catch(error => {
        console.error('Fetch error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        setError(error);
      });
    } else {
        setError("You are not signed in");
    }
}, [token]);



  return (
    <div className="feed">
        <h1>Your Feed</h1>
        { (blogs.length===0 || error) ? <p>No blogs are in your feed just yet. Try following some bloggers first!</p> :
        <BlogFeed blogs={blogs} flag={false}/> }
    </div>
  )

}

export default Feed;

