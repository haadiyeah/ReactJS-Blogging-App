import React from 'react';
import ReactStars from "react-rating-stars-component";

type RatingProps = {
    onRatingChange: (newRating: number) => void;
};

const Rating: React.FC<RatingProps> = ({ onRatingChange }) => {
    return (
        <ReactStars
            count={5}
            onChange={onRatingChange}
            size={24}
            activeColor="#ffd700"
        />
    );
};

export default Rating;