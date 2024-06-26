import React from 'react';
import Blog from './Blog';
import { Link } from 'react-router-dom';
import '../assets/styles/blogfeed.css';

interface BlogType {
    _id: string;
    id: string;
    image?: string;
    createdAt: string;
    title: string;
    averageRating: number;
    blurb?: string;
    content: string;
    owner: string;
}

interface BlogFeedProps {
    blogs: BlogType[];
    flag: boolean;
}

const BlogFeed: React.FC<BlogFeedProps> = ({ blogs, flag }) => {
    if (!blogs) {
        return (
            <div className="blogfeed">
                <h1>No blog posts found!</h1>
                <p>Try searching using different keywords.</p>
            </div>
        );
    }
    return (
        <div className="blogfeed">
            {blogs.length > 0 && <h1 id="fresh">Fresh from the Blog!</h1>}
            {blogs.length <= 0 && <h1 id="fresh">No posts found, try a different keyword.</h1>}
            <ul className="blogFeedList">
                {blogs.map(blog => (
                    <Blog key={blog._id} blog={blog} flag={flag} />
                ))}
            </ul>
        </div>
    );
};

export default BlogFeed;