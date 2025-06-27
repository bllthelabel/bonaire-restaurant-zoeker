
import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

const StarIcon: React.FC<{ fill: string }> = ({ fill }) => (
    <svg className="w-5 h-5" fill={fill} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const stars = [];
  const fullColor = "currentColor";
  const emptyColor = "#e5e7eb"; // gray-200

  for (let i = 1; i <= maxStars; i++) {
    let fill = emptyColor;
    if (i <= rating) {
      fill = fullColor;
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      // This is for half stars, but for simplicity we will just show full or empty
      // for a cleaner UI. The original didn't have true half stars either.
      // To implement half stars, you would need a half-star icon or use gradients.
    }
    
    stars.push(<StarIcon key={i} fill={fill} />);
  }

  return (
    <div className="flex items-center text-amber-400">
      {stars}
    </div>
  );
};

export default StarRating;
