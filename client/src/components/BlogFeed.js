import React from 'react';
import Blog from './Blog';
import { Link } from 'react-router-dom';
import '../assets/styles/blogfeed.css';

function BlogFeed({ blogs }) {
    console.log("BLOGS IN BLOGFEED COMPONENT" + blogs);
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
            <h1>Fresh from the Blog!</h1>
            <ul class="blogFeedList">
                {blogs.map(blog => {
                    return(
                        <Link to={`/blogs/${blog._id}`} key={blog._id}>
                            <Blog blog={blog} />
                        </Link>
                    );
                })}
            </ul>
        </div>
    )
}
export default BlogFeed;

