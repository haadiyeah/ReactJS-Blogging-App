import React from 'react';
import Blog from './Blog';
import '../assets/styles/blogfeed.css';

  function BlogFeed({blogs}) {
    console.log("BLOGS IN BLOGFEED COMPONENT" + blogs);
    return (
      <div>
        <h1>Blog Feed</h1>
        <ul class="blogFeedList">
          {blogs.map(blog => {
            return <Blog blog={blog}> </Blog>
          })}
        </ul>
      </div>
    )
  }
export default BlogFeed;

  