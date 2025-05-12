import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSearchedAds, 
  clearSearchedAds, 
  getAllads,
  addFavorite,
  removeFavorite,
  getFavorites
} from '../features/ads/adsSlice';
import { Link } from "react-router-dom";
import Search from './Search';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Filter from './Filter';
import { toast } from 'react-toastify';

// Custom arrow components with improved styling
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} rounded-full bg-white bg-opacity-80 shadow-md p-1 hover:bg-orange-100 transition-all`}
      style={{ 
        ...style, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        right: "12px",
        zIndex: 1
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} rounded-full bg-white bg-opacity-80 shadow-md p-1 hover:bg-orange-100 transition-all`}
      style={{ 
        ...style, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        left: "12px",
        zIndex: 1
      }}
      onClick={onClick}
    />
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const { 
    ads, 
    isLoading, 
    isError, 
    isSuccess, 
    message, 
    searchedAds, 
    AdsFilter,
    favorites 
  } = useSelector(state => state.ads);
  
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteAds, setFavoriteAds] = useState([]);
  const [pendingFavoriteActions, setPendingFavoriteActions] = useState({});
  
  const adsToDisplay = searchedAds.length ? searchedAds : AdsFilter.length ? AdsFilter : ads;

  useEffect(() => {
    dispatch(getAllads());
    dispatch(getFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (favorites && favorites.items) {
      setFavoriteAds(favorites.items.map(fav => fav.ad._id));
    }
  }, [favorites]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFavoriteClick = async (adId, adTitle) => {
    // Set pending state for this specific ad
    setPendingFavoriteActions(prev => ({ ...prev, [adId]: true }));
    
    try {
      if (favoriteAds.includes(adId)) {
        // Optimistically update local state for immediate UI feedback
        setFavoriteAds(prev => prev.filter(id => id !== adId));
        
        await dispatch(removeFavorite(adId)).unwrap();
        toast.success(`Removed "${adTitle}" from favorites`);
      } else {
        // Optimistically update local state for immediate UI feedback
        setFavoriteAds(prev => [...prev, adId]);
        
        await dispatch(addFavorite(adId)).unwrap();
        toast.success(`Added "${adTitle}" to favorites`);
      }
    } catch (error) {
      // Revert optimistic update on error
      if (favoriteAds.includes(adId)) {
        setFavoriteAds(prev => prev.filter(id => id !== adId));
      } else {
        setFavoriteAds(prev => [...prev, adId]);
      }
      
      // Show error message
      toast.error(`Could not update favorites: ${error.message || 'Unknown error'}`);
    } finally {
      // Clear pending state
      setPendingFavoriteActions(prev => ({ ...prev, [adId]: false }));
      
      // Refresh favorites list from server
      dispatch(getFavorites());
    }
  };

  // Base slider settings - only apply to multiple images
  const getSliderSettings = (images) => {
    if (!images || images.length <= 1) return {};
    
    return {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      adaptiveHeight: false,
      lazyLoad: 'ondemand',
      dotsClass: "slick-dots custom-dots",
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      appendDots: dots => (
        <div>
          <ul className="absolute bottom-2 m-0 p-0 w-full flex justify-center"> {dots} </ul>
        </div>
      ),
      customPaging: i => (
        <div className="w-2 h-2 mx-1 rounded-full bg-white bg-opacity-70 hover:bg-orange-500"></div>
      )
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="mt-2 text-gray-600">Browse available listings or find exactly what you're looking for</p>
      </div>

      {/* Status Messages */}
      {isLoading && (
        <div className="w-full bg-blue-50 text-blue-700 p-4 rounded-lg shadow-sm mb-6 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading listings...
        </div>
      )}
      
      {isError && (
        <div className="w-full bg-red-50 text-red-700 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Error: {message}</p>
            </div>
          </div>
        </div>
      )}
      
      {isSuccess && adsToDisplay.length === 0 && (
        <div className="w-full bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">No listings available at this time.</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <Search />
          </div>
          
          <div className="px-6 pb-4">
            <button 
              onClick={toggleFilters}
              className="flex items-center justify-center w-full py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:outline-none"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              <svg 
                className={`ml-2 h-5 w-5 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Expandable Filter Section */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6">
              <Filter />
            </div>
          </div>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adsToDisplay.map(ad => {
          const sliderSettings = getSliderSettings(ad.images);
          const isFavorite = favoriteAds.includes(ad._id);
          const isPending = pendingFavoriteActions[ad._id];

          return (
            <div key={ad._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
              {/* Image Carousel */}
              <div className="relative h-48 bg-gray-100">
                {ad.images && ad.images.length > 0 ? (
                  ad.images.length === 1 ? (
                    // Single image - no slider needed
                    <div className="h-48">
                      <img
                        src={`http://localhost:5000/uploads/${ad.images[0]}`}
                        alt={ad.title}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  ) : (
                    // Multiple images - use slider
                    <Slider {...sliderSettings} className="h-48">
                      {ad.images.map((image, index) => (
                        <div key={index} className="h-48">
                          <img
                            src={`http://localhost:5000/uploads/${image}`}
                            alt={`${ad.title} - ${index}`}
                            className="h-48 w-full object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  )
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                    <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Price Tag */}
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-md">
                  <span className="font-semibold text-orange-600">${ad.price}</span>
                </div>

                {/* Favorite Button - Enhanced with loading state */}
                <button
                  onClick={() => handleFavoriteClick(ad._id, ad.title)}
                  disabled={isPending}
                  className={`absolute top-3 left-3 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all ${isPending ? 'cursor-not-allowed opacity-75' : ''}`}
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
                      className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      viewBox="0 0 20 20"
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
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
                
                {/* Specs/Details */}
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
                
                {/* Stats & Link */}
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
        })}
      </div>
      
      {/* Empty State */}
      {!isLoading && isSuccess && adsToDisplay.length === 0 && (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}