import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/blogdetail.css';  //import css file
import { formatTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js
import { formatNotifTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js
import useStore from '../store/store'; //zustand 
import defaultImg from '../assets/images/default_image.jpg'; //import default image
import CommentSection from '../components/CommentSection';
import RatingArea from '../components/RatingArea';

//Blog page to display details of a particular blog
//On the route /blogs/:blogId
function Blog() {
    const { token, setToken } = useStore(); //getting token
    const [blog, setBlog] = useState(null); //stores the object
    const { blogId } = useParams();//get from url
    const [imageUrl, setImageUrl] = useState(defaultImg); // state variable for the image URL
    const [message, setMessage] = useState(''); // state variable for the message 
    const [isFollowing, setIsFollowing] = useState(false); // state variable for the follow status

    useEffect(() => {
        fetch(`http://localhost:3000/blogs/${blogId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.createdAt = formatTimestamp(data.createdAt);
                if (data.image) {
                    setImageUrl(data.image); // update the image URL state variable
                }
                setBlog(data);
            })
            .catch(error => console.error('Error:', error));
    }, [blogId]);

    const handleFollow = async () => {
        if(!token){
            setMessage("You must log in to follow or unfollow this blogger.");
            return;
        }
    
        const endpoint = isFollowing ? 'unfollow' : 'follow'; //SO SMART HAHAHHAUEUEUE
        const response = await fetch(`http://localhost:3000/interaction/${endpoint}/${blog.owner}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
            },
        });
    
        const message = await response.text();
        setMessage(message);
        if (response.ok) {
            setIsFollowing(!isFollowing); // toggle the follow status
        } else {
            if(message.includes('already following'))
            setIsFollowing(true);
           
            console.error('Error:', message);
        }
    };


    if (!blog) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="blogContainer">

            <div class="blogDetail">
                {/*Blog header */}
                <div class="blogHeader" key={blog.id} style={{ backgroundImage: `url("${imageUrl}")` }}>
                    <div class="blogBrief">
                        <h4 class="blogTitle">{blog.title} </h4>
                        <b class="blogSubtitle ratingtitle">  {"⭐ " + blog.averageRating.toFixed(2)}</b>                        <p class="blogSubtitle">{blog.blurb ? blog.blurb : null}</p>
                        <p class="blogSubtitle blogDetailTimestamp">{"Posted by " + blog.owner + " , " + formatNotifTimestamp(blog.createdAt)}</p>
                        <p class="blogSubtitle blogDetailTimestamp">{formatTimestamp(blog.createdAt)}</p>
                    </div>
                </div>

                {/*Actual blog content */}
                <div class="blogContent">
                    <p class="blogText">{blog.content}</p>
                    <hr />
                    {"By " + blog.owner}
                    <button className='btn btn-secondary' onClick={handleFollow} disabled={message == 'Cannot follow yourself'}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <p className='commentText'>{message}</p>
                </div>
            </div>

            <RatingArea blogId={blogId} />

            <CommentSection blog={blog} setBlog={setBlog} blogId={blogId} />

        </div>
    )
}

export default Blog;