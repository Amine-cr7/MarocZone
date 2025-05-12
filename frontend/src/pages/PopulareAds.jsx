import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { getPopulareAds } from '../features/ads/adsSlice';

export default function PopularAds() {
  const dispatch = useDispatch();
  const { ads, isLoading,  } = useSelector(state => state.ads)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPopulareAds());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">🔥 Popular Ads</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-60 animate-pulse bg-orange-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ads .filter(ad => ad.status === 'published')
                       .map((ad) => (
            <div
              key={ad._id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <img
                src={`http://localhost:5000/uploads/${ad.images?.[0] || ''}`}
                alt={ad.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{ad.title}</h3>
                <p className="text-sm text-gray-500 mb-2">${ad.price}</p>
                <div className="text-xs text-gray-400 mb-3">👁 {ad.views} views</div>
                <button
                  onClick={() => navigate(`/ads/${ad._id}`)}
                  className="inline-block px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                >
                  View Ad
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
