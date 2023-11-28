import React from 'react';
import Blog from './Blog';
import { Link } from 'react-router-dom';
import '../assets/styles/blogfeed.css';

function BlogFeed({ blogs, flag }) {
    if(!blogs) {
        return (
            <div className="blogfeed">
            <h1>No blog posts found!</h1>
            <p>Try searching using different keywords.</p>
        </div>
        )
    }
    return (
        <div className="blogfeed">
            {blogs.length>0 && <h1 id = "fresh">Fresh from the Blog!</h1>}
            {blogs.length<=0 && <h1 id = "fresh">No posts found, try a different keyword.</h1>}
            <ul class="blogFeedList">
                {blogs.map(blog => {
                    return(
                       
                            <Blog blog={blog} flag={flag} />
                    );
                })}
            </ul>
        </div>
    )
}
export default BlogFeed;

