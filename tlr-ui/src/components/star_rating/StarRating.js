import "./starRating.scss";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";

export default function StarRating() {
  const [rating, setRating] = useState(Math.floor(Math.random() * 100)); // initial rating value

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // other logic
  };

  return (
    <div className="star-rating-wrapper">
      <Rating onClick={handleRating} ratingValue={rating} size={18} />
      <span className="star-rating-text">{`${((rating / 100) * 5).toFixed(
        1
      )} / 5 Stars`}</span>
    </div>
  );
}
