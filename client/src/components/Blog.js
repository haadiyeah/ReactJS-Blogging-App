import React from 'react';
import '../assets/styles/blogfeed.css';

function Blog({ blog }) {
    let url;
    if (blog.image) {
        url = blog.image;
    } else {
        url = "https://w0.peakpx.com/wallpaper/902/542/HD-wallpaper-zelda-the-legend-of-zelda-breath-of-the-wild.jpg"
    }

    function formatTimestamp(inputTimestamp) {
        const date = new Date(inputTimestamp);

        //date components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        //time components
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        //formatted string
        const formattedString = `${year}-${month}-${day}, ${hours}:${minutes}`;

        return formattedString;
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
                    <p class="blogSubtitle">{blog.content}</p>
                    <p class="blogSubtitle blogTimeStamp">{blog.createdAt + " by " +blog.owner}</p>
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