import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAdById } from '../features/ads/adsSlice';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

const AdDetails = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const { ad, isLoading, isError, message } = useSelector(state => state.ads);

  useEffect(() => {
    dispatch(getAdById(_id));
  }, [dispatch, _id]);

  // Slider settings
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {ad.images?.length > 0 && (
        <div className="mb-6">
          <Slider {...sliderSettings}>
            {ad.images.map((image, idx) => (
              <div key={idx}>
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
      <p className="text-lg font-medium text-gray-800 mb-2">Price: ${ad.price}</p>
      <p className="text-gray-600 mb-2">Location: {ad.location}</p>
      <p className="text-gray-600">Views: {ad.views}</p>
    </div>
  );
};

export default AdDetails;