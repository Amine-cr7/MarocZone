import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAdById, getComments, addComment, getRatings, addRating } from '../features/ads/adsSlice';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast } from 'react-toastify';

// Custom arrow components for react-slick
const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10 hover:bg-orange-600 transition"
    onClick={onClick}
    aria-label="Next image"
  >
    →
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full z-10 hover:bg-orange-600 transition"
    onClick={onClick}
    aria-label="Previous image"
  >
    ←
  </button>
);

// Star Rating Component
const StarRating = ({ rating, onRate, interactive = true }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={`star-${star}`}
          type="button"
          className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} ${
            interactive ? 'hover:text-yellow-400' : ''
          }`}
          onClick={() => interactive && onRate(star)}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const AdDetails = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const { ad, isLoading, isError, message } = useSelector(state => state.ads);
  const { user } = useSelector(state => state.auth);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    dispatch(getAdById(_id));
    dispatch(getComments(_id));
    dispatch(getRatings(_id));
  }, [dispatch, _id]);

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    dispatch(addComment({ id: _id, text: commentText }));
    setCommentText('');
  };

  const handleAddRating = (stars) => {
    if (!user) {
      toast.error('Please login to rate');
      return;
    }
    setUserRating(stars);
    dispatch(addRating({ id: _id, stars }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {message || "Something went wrong!"}</div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">No ad found for the ID: {_id}</div>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    ...(ad?.images?.length > 1 ? {
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    } : { arrows: false })
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Image Slider */}
      {ad.images?.length > 0 && (
        <div className="mb-6">
          <Slider {...sliderSettings}>
            {ad.images.map((image, idx) => (
              <div key={`${image}-${idx}`}>
                <img
                  src={`http://localhost:5000/uploads/${image}`}
                  alt={`${ad.title} ${idx + 1}`}
                  className="w-full h-96 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{ad.title}</h1>
      <p className="text-gray-600 mb-4">{ad.description}</p>
      
      {/* Ratings Section */}
      <div className="my-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Ratings</h3>
        <div className="flex items-center mb-4">
          <StarRating rating={ad.averageRating || 0} interactive={false} />
          <span className="ml-2 text-gray-600">
            ({ad.ratings?.length || 0} ratings)
          </span>
        </div>
        <div>
          <p className="mb-2">Rate this ad:</p>
          <StarRating rating={userRating} onRate={handleAddRating} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-lg font-medium text-gray-800 mb-2">Price: ${ad.price}</p>
          <p className="text-gray-600 mb-2">Location: {ad.location}</p>
          <p className="text-gray-600">Views: {ad.views}</p>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold mb-4">Comments ({ad.comments?.length || 0})</h3>
        
        {user && (
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows="3"
              placeholder="Write your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              onClick={handleAddComment}
            >
              Post Comment
            </button>
          </div>
        )}
        
        {ad.comments?.length > 0 ? (
          <div className="space-y-4">
            {ad.comments.map((comment) => (
              <div key={comment._id || `${comment.userId}-${comment.createdAt}`} className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.user?.FullName || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default AdDetails;