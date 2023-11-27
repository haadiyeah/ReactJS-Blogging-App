import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/store'; //zustand 


function CommentSection({blog, setBlog, blogId}) {
    const [comment, setComment] = useState(''); //for the new comment
    const { token, setToken } = useStore(); //getting token
    const commentRef = useRef(); // reference to the textarea element


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
            setBlog({ ...blog, comments: [newComment, ...blog.comments] }); //update the comments array

            setComment(''); // clear the textarea
        } else {
            console.error('Error:', await response.text());
        }
    };

    
    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };



    return (
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

            {token ? <h4>Leave a Comment</h4> : <i>You must log in to leave a comment.</i>}
            {/* <h4>Leave a Comment</h4> */}

            {token ? <div class="commentForm">
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
    )
}

export default CommentSection;