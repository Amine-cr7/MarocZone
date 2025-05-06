import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAdByUser } from '../features/ads/adsSlice';

export default function UserAds() {
  const dispatch = useDispatch();
  const { myAds, isLoading } = useSelector((state) => state.ads);

  useEffect(() => {
    dispatch(getAdByUser());
  }, [dispatch]);

  const handleDelete = (id) => {
    // if (window.confirm('Are you sure you want to delete this ad?')) {
    //   dispatch(deleteAd(id));
    // }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">Manage Your Ads</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="animate-pulse h-24 bg-orange-100 rounded-lg" />
          ))}
        </div>
      ) : myAds.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">You haven’t posted any ads yet.</p>
          <button className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition">
            Create New Ad
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600">Ad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600">Posted On</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-orange-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {myAds.map((ad) => (
                <tr key={ad._id} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-5 flex items-center gap-4">
                    <img
                      src={`http://localhost:5000/uploads/${ad.images?.[0] || ''}`}
                      alt={ad.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-800">{ad.title}</div>
                      <div className="text-sm text-gray-500">${ad.price}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                        ad.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-700">{ad.views}</td>
                  <td className="px-6 py-5 text-gray-700">{new Date(ad.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end flex-wrap gap-3">
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg shadow hover:bg-orange-600 transition"
                        onClick={() => console.log('Edit', ad._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow hover:bg-red-600 transition"
                        onClick={() => handleDelete(ad._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
