import React, { useState, useEffect, useRef, FormEvent } from 'react';
import useStore from '../store/store'; // Zustand

interface Comment {
    id: string;
    user: string;
    text: string;
}

interface Blog {
    _id: string;
    id: string;
    image?: string;
    createdAt: string;
    title: string;
    averageRating: number;
    blurb?: string;
    content: string;
    owner: string;
    comments: Comment[];
}

interface CommentSectionProps {
    blog: Blog;
    setBlog: React.Dispatch<React.SetStateAction<Blog>>;
    blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blog, setBlog, blogId }) => {
    const [comment, setComment] = useState<string>(''); // For the new comment
    const { token } = useStore(); // Getting token
    const commentRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea element

    const handleCommentSubmit = async (event: FormEvent) => {
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
            setBlog({ ...blog, comments: [newComment, ...blog.comments] }); // Update the comments array

            setComment(''); // Clear the textarea
        } else {
            console.error('Error:', await response.text());
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    return (
        <div id="commentSection">
            <h4>Comments</h4>
            <ul>
                {blog.comments.length === 0 ? (
                    <i>No comments yet. Why not start the conversation?<hr /></i>
                ) : (
                    blog.comments.map((comment) => (
                        <li key={comment.id}>
                            <div className="comment">
                                <b className="commenter"> {comment.user} </b>
                                <p className="commentText">{comment.text}</p>
                            </div>
                            <hr />
                        </li>
                    ))
                )}
            </ul>

            {token ? <h4>Leave a Comment</h4> : <i>You must log in to leave a comment.</i>}

            {token ? (
                <div className="commentForm">
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            id="commentArea"
                            placeholder="Type your thoughts..."
                            value={comment}
                            onChange={handleCommentChange}
                            ref={commentRef}
                            required
                        />
                        <br />
                        <input id="submitComment" type="submit" value="Submit" />
                    </form>
                </div>
            ) : null}
        </div>
    );
};

export default CommentSection;