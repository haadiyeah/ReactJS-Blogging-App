
import Rating from '../components/Rating';
import { useState } from 'react';
import useStore from '../store/store'; //zustand

function RatingArea({blogId}) {
    const { token, setToken } = useStore(); //getting token
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState(''); // state variable for the message in rating

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleRatingSubmit = async () => {
        if(!token){
            setMessage("You must log in to rate this blog.");
            setTimeout(() => setMessage(''), 1200); // clear the message after 2 seconds
            return;
        }

        const response = await fetch(`http://localhost:3000/blogs/rate/${blogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating }),
        });

        if (response.ok) {
            const message = await response.text();
            setMessage(message);
            setTimeout(() => setMessage(''), 1200); // clear the message after 2 seconds
        } else {
            console.error('Error:', await response.text());
        }
    };

    return (
        <div class="blogDetail ratingArea">
        <h4>Rate this blog</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Rating onRatingChange={handleRatingChange} />
            <button id="submitRating" onClick={handleRatingSubmit}>✔</button>
        </div>
        <p class="commentText" id="ratingMsg" style={{ margin: '0', float: 'right' }}>{message}</p>
    </div>
    )

} 

export default RatingArea;