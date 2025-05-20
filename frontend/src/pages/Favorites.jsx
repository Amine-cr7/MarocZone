import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFavorites } from '../features/ads/adsSlice';

export default function Favorites() {
  const dispatch = useDispatch();
  const { favorites, isLoading } = useSelector(state => state.ads);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-60 animate-pulse bg-orange-100 rounded-xl" />
          ))}
        </div>
      );
    }

    if (!favorites || favorites.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">You don't have any favorite ads yet.</p>
          <button
            onClick={() => navigate('/ads')}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            Browse Ads
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.items.map((favorite) => {
          const ad = favorite.ad;
          
          
          if (ad.status !== 'published') {
            return null;
          }
          
          return (
            <div
              key={favorite._id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="w-full h-48">
                <img
                  src={ad.images?.[0] ? `http://localhost:5000/uploads/${ad.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{ad.title}</h3>
                <p className="text-sm text-gray-500 mb-2">${ad.price}</p>
                <div className="text-xs text-gray-400 mb-3">👁 {ad.views || 0} views</div>
                <button
                  onClick={() => navigate(`/ads/${ad._id}`)}
                  className="inline-block px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  View Ad
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">❤️ My Favorites</h2>
      {renderContent()}
    </div>
  );
}