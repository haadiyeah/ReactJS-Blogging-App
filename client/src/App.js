import React from 'react';
import './App.css';
import { useState } from 'react';

///document.getElementById("textbox").value

function App() {
 

  const [blogs, setBlogs] = React.useState("");
  fetch('http://localhost:3000/blogs')
    .then(response => response.json())
    .then(data => setBlogs( JSON.stringify(data)) )
    .catch(error => console.error(error));

  return (
    <div className="App">
      
      <h1>Blogss</h1>
      {blogs}
    </div>
  )

}

export default App;

