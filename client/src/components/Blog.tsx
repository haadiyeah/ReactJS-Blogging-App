import React, { useState } from 'react';
import '../assets/styles/blogfeed.css';
import useStore from '../store/store'; // Zustand global thingy
import myImage from '../assets/images/default_image.jpg'; // Import default image
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/profile.css';
import { formatTimestamp } from '../utils/utils'; // Import formatTimestamp function from utils.js

interface BlogProps {
    blog: {
        _id: string;
        id: string;
        image?: string;
        createdAt: string | Date ;
        title: string;
        averageRating: number;
        blurb?: string;
        content: string;
        owner: string;
    };
    flag: boolean;
}

// Blog component which displays as a tile in the BlogFeed component
const Blog: React.FC<BlogProps> = ({ blog, flag }) => {
    const { token } = useStore(); // Getting token
    const [isDeleted, setIsDeleted] = useState(false);
    const navigate = useNavigate();

    const url = blog.image ? blog.image : myImage;
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
                    'Authorization': token,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting the blog post');
            }

            alert('Blog post deleted successfully');
            setIsDeleted(true);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const editBlog = () => {
        navigate(`/create/${blog._id}`);
    };

    if (isDeleted) {
        return (
            <li>
                <p> You deleted this post. </p>
            </li>
        );
    }

    return (
        <li>
            <Link to={`/blogs/${blog._id}`} key={blog._id}>
                <div className="blog" key={blog.id} style={{
                    backgroundImage: `url("${url}")`
                }}>
                    <div className="blogBrief">
                        <h4 className="blogTitle">{blog.title}</h4>
                        <b className="blogSubtitle ratingtitle">{"⭐ " + blog.averageRating.toFixed(2)}</b>
                        <p className="blogSubtitle">
                            {blog.blurb ? blog.blurb : (blog.content.length > 90 ? `${blog.content.substring(0, 90)}...` : blog.content)}
                        </p>
                        <p className="blogSubtitle blogTimeStamp">{blog.createdAt + " by " + blog.owner}</p>
                    </div>
                </div>
            </Link>
            {flag ? <div className="modifybtns">
                <button onClick={editBlog} className="blogButton">✍ Edit</button>
                <button onClick={deleteBlog} className="blogButton">❌ Delete</button>
            </div> : null}
        </li>
    );
};

export default Blog;