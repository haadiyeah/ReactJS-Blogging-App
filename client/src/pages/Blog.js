import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/blogdetail.css';  //import css file
import { formatTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js
import { formatNotifTimestamp } from '../utils/utils'; //import formatTimestamp function from utils.js
import useStore from '../store/store'; //zustand 
import defaultImg from '../assets/images/default_image.jpg'; //import default image


//Blog page to display details of a particular blog
//On the route /blogs/:blogId
function Blog() {
    const { token, setToken } = useStore(); //getting token
    const [blog, setBlog] = useState(null); //stores the object
    const { blogId } = useParams();//get from url
    const [comment, setComment] = useState(''); //for the new comment
    const commentRef = useRef(); // reference to the textarea element
    const [imageUrl, setImageUrl] = useState(defaultImg); // state variable for the image URL

useEffect(() => {
    fetch(`http://localhost:3000/blogs/${blogId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then( data => {
            data.createdAt = formatTimestamp(data.createdAt);
            if (data.image) {
                setImageUrl(data.image); // update the image URL state variable
            }
            setBlog(data);
        })
        .catch(error => console.error('Error:', error));
}, [blogId]);


    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`http://localhost:3000/blogs/comment/${blogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: comment }),
        });

        if (response.ok) {
            const { newComment } = await response.json();
            console.log("NEW" + newComment.user)
            setBlog({ ...blog, comments: [ newComment, ...blog.comments] }); //update the comments array
            
            setComment(''); // clear the textarea
        } else {
            console.error('Error:', await response.text());
        }
    };


    if (!blog) {
        return <div>Loading...</div>;
    }

    // console.log("blog");
    return (
        <div className="blogContainer">

            <div class="blogDetail">
                {/*Blog header */}
                <div class="blogHeader" key={blog.id} style={{ backgroundImage: `url("${imageUrl}")` }}>
                    <div class="blogBrief">
                        <h4 class="blogTitle">{blog.title}</h4>
                        <p class="blogSubtitle">{blog.blurb ? blog.blurb : null}</p>
                        <p class="blogSubtitle blogDetailTimestamp">{"Posted by " + blog.owner + " , " + formatNotifTimestamp( blog.createdAt)}</p>
                        <p class="blogSubtitle blogDetailTimestamp">{formatTimestamp( blog.createdAt)}</p>
                    </div>
                </div>

                {/*Actual blog content */}
                <div class="blogContent">
                    <p class="blogText">{blog.content}</p>
                </div>
            </div>

            <div id="commentSection">
                <h4>Comments</h4>
                <ul >
                    {blog.comments.length === 0 ? <i>No comments yet. Why not start the conversation?<hr></hr> </i> :
                        
                            blog.comments.map((comment) => (
                                <li key={comment.id}>
                                    <div class="comment">
                                        <b class="commenter"> {comment.user} </b>
                                        <p class="commentText">{comment.text}</p>
                                    </div>
                                    <hr></hr>
                                </li>
                            ))
                    }
                </ul>

                { token ? <h4>Leave a Comment</h4> : <i>You must log in to leave a comment.</i> }
                {/* <h4>Leave a Comment</h4> */}

                { token ?  <div class="commentForm">
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            id="commentArea"
                            placeholder="Type your thoughts..."
                            value={comment}
                            onChange={handleCommentChange}
                            ref={commentRef}
                            required
                        />
                        <br></br>
                        <input id='submitComment' type="submit" value="Submit" />
                    </form>
                </div> : null}
               
            </div>
        </div>
    )
}

export default Blog;