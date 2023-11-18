import React from 'react';
import '../assets/styles/blogfeed.css';

  function Sidebar({blogs}) {
    return (
      <div class="sidebar">
        <h1>Search</h1>
        <form>
          <input type="text" placeholder="Search..."></input>
        </form>
        <h1>Categories</h1>
        <ul>
          <li>Category 1</li>
          <li>Category 2</li>
          <li>Category 3</li>
          <li>Category 4</li>
          </ul>

      </div>
    )
  }
export default Sidebar;

  