import React from 'react';
import './App.css';
import { useState } from 'react';
import BlogFeed from './components/BlogFeed';
import Sidebar from './components/Sidebar';
import './assets/styles/blogfeed.css';  //import css file

///document.getElementById("textbox").value

function App() {
  const [blogs, setBlogs] = React.useState([]);

  fetch('http://localhost:3000/blogs')
    .then(response => response.json())
    .then(data => {
      setBlogs(data);
    } 
    )
    .catch(error => console.error(error));
  return (
    <div className="App">
      <BlogFeed blogs={blogs}/>
      <Sidebar className="sidebar" />
    </div>
  )

}

export default App;

