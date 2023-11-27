import React from 'react';
import '../assets/styles/blogfeed.css';
import myImage from '../assets/images/default_image.jpg'; //import default image

import { formatTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js

function Blog({ blog }) {
    let url = blog.image? blog.image : myImage; 
    blog.createdAt = formatTimestamp(blog.createdAt);

    return (
        <li >
            <div class="blog" key={blog.id} style={{
                backgroundImage: `url("${url}")`
            }}>
                <div class="blogBrief">
                    <h4 class="blogTitle">{blog.title}</h4>
                    <p class="blogSubtitle">
                    {blog.blurb ? blog.blurb : (blog.content.length > 90 ? `${blog.content.substring(0, 90)}...` : blog.content)}                    </p>
                    <p class="blogSubtitle blogTimeStamp">{blog.createdAt + " by " + blog.owner}</p>
                    {/* <p>Owner: {blog.owner}</p>
                    <p>Average Rating: {blog.averageRating}</p> */}
                    {/* <p>Comments: {blog.comments}</p> */}
                    {/* <p>Visible: {blog.isVisible}</p> */}
                    {/* <p>Categories: {blog.categories}</p> */}
                </div>
            </div>
        </li>
    )
}

export default Blog;