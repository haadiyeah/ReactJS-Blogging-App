import React from 'react';
import '../assets/styles/blogfeed.css';
import myImage from '../assets/images/default_image.jpg'; //import default image

import { formatTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js

function Blog({ blog }) {
    let url;
    if (blog.image) {
        url = blog.image;
    } else {
        url = myImage;
    }

    blog.createdAt = formatTimestamp(blog.createdAt);

    // console.log("blog");
    return (
        <li >
            <div class="blog" key={blog.id} style={{
                backgroundImage: `url("${url}")`
            }}>
                <div class="blogBrief">
                    <h4 class="blogTitle">{blog.title}</h4>
                    <p class="blogSubtitle">
                        {blog.blurb ? blog.blurb : `${blog.content.substring(0, 90)}...`}
                    </p>
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