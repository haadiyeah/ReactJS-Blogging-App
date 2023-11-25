import './assets/styles/blogfeed.css';  //import css file
import './assets/styles/global.css';
import BlogFeed from './components/BlogFeed';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './assets/styles/blogfeed.css';  //import css file
import React, { useState, useEffect } from 'react';
///document.getElementById("textbox").value

function App() {
  const [blogs, setBlogs] = React.useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // start from page 1
  const [limit, setLimit] = useState(5); // start from page 1
  const [totalPages, setTotalPages] = useState(2); // start from page 1

  useEffect(() => {
    fetch(`http://localhost:3000/blogs?page=${page}&limit=${limit}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then(data => { setBlogs(data.blogs); setTotalPages(data.totalPages); })
      .catch(error => {
        console.error('Fetch error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        setError(error);
      });
  }, [page]); //this will re-run the effect when 'page' state changes

  const handleNextPage = () => setPage(page + 1); 
  const handlePrevPage = () => setPage(page - 1 ); 

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="App">
      <Navbar></Navbar>

      <div class="content">
        <Sidebar className="sidebar" setBlogs={setBlogs} setLimit={setLimit} limit={limit} setPage={setPage} setTotalPages={setTotalPages}/>
        <BlogFeed blogs={blogs} />
      </div>

      <div id="paginationButtons">
        <button id="prevButton" onClick={handlePrevPage} disabled={(page == 1)}>  ◀ </button>
        <p id="paginationInfo">Page {page} of {totalPages}</p>
        <button id="nextButton" onClick={handleNextPage} disabled={(page == totalPages)}> ▶ </button>
      </div>
    </div>
  )

}

export default App;

