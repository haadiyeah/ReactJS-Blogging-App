import React from 'react';
import '../assets/styles/blogfeed.css';
import useStore from '../store/store'; //zustand global thingy
import myImage from '../assets/images/default_image.jpg'; //import default image
import { Link } from 'react-router-dom';
import '../assets/styles/profile.css';
import { formatTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js
import { useNavigate } from 'react-router-dom';

//*** Blog component which displays as a tile in the BlogFeed component ***//
function Blog({ blog, flag }) {
    const { token, setToken } = useStore(); //getting token
    const [isDeleted, setIsDeleted] = React.useState(false);
    const navigate = useNavigate();

    let url = blog.image ? blog.image : myImage;
    blog.createdAt = formatTimestamp(blog.createdAt);

    const deleteBlog = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this blog post?');
        if (!confirmation) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/blogs/${blog._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting the blog post');
            }

            alert('Blog post deleted successfully');
            setIsDeleted(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const editBlog = () => {
        navigate(`/create/${blog._id}`);
    };

    if (isDeleted) {
        return (
            <li>
                <p>You deleted this post.</p>
            </li>
        )
    }

    return (
        <li>
            <Link to={`/blogs/${blog._id}`} key={blog._id}>
                <div class="blog" key={blog.id} style={{
                    backgroundImage: `url("${url}")`
                }}>
                    <div class="blogBrief">
                        <h4 class="blogTitle">{blog.title}</h4>
                        <b class="blogSubtitle ratingtitle">  {"⭐ " + blog.averageRating.toFixed(2)}</b>
                        <p class="blogSubtitle">
                            {blog.blurb ? blog.blurb : (blog.content.length > 90 ? `${blog.content.substring(0, 90)}...` : blog.content)}                    </p>
                        <p class="blogSubtitle blogTimeStamp">{blog.createdAt + " by " + blog.owner}</p>
                    </div>
                </div>
            </Link>
            {flag ? <div className="modifybtns">
                {/* HEART BROKEN FROM THIS CODE <button class="blogButton"> 
                    <Link className="link editbtn" to={{ pathname: "/create", state: { blog: blog } }}>✍ Edit</Link>
                    </button> */}

                <button onClick={editBlog} class="blogButton">✍ Edit</button>
                <button onClick={deleteBlog} class="blogButton">❌ Delete</button>

            </div> : null}
        </li>
    )
}

export default Blog;