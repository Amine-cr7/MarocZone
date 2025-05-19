import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';

const AdCard = ({ ad, isFavorite, isPending, onFavoriteClick }) => {
     if (!ad || !ad._id) {
    return null; // or return a placeholder/skeleton component
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        <ImageSlider images={ad.images} title={ad.title} />
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-md">
          <span className="font-semibold text-orange-600">${ad.price}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteClick(ad._id, ad.title)}
          disabled={isPending}
          className={`absolute top-3 left-3 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all ${
            isPending ? 'cursor-not-allowed opacity-75' : ''
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isPending ? (
            <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill={isFavorite ? '#ef4444' : 'none'}
              stroke={isFavorite ? '#ef4444' : '#9ca3af'}
              strokeWidth="2"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">{ad.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{ad.location}</span>
        </div>
        
        {ad.details && Object.keys(ad.details).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(ad.details).slice(0, 3).map(([key, value]) => (
              <span key={key} className="inline-flex text-xs bg-gray-100 rounded-full px-2 py-1">
                <span className="font-medium">{key}:</span> {value}
              </span>
            ))}
            {Object.keys(ad.details).length > 3 && (
              <span className="inline-flex text-xs bg-gray-100 rounded-full px-2 py-1">
                + {Object.keys(ad.details).length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {ad.views} views
          </div>
          
          <Link
            to={`/ads/${ad._id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdCard;