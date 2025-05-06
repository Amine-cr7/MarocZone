<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAdByUser } from '../features/ads/adsSlice';

export default function UserAds() {
  const dispatch = useDispatch();
  const { myAds, isLoading } = useSelector((state) => state.ads);

  useEffect(() => {
    dispatch(getAdByUser());
  }, [dispatch]);


  return (
    <div>
      {isLoading ? <p>Loading your ads...</p> : <p>UserAds component loaded</p>}
=======
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdsbyUser } from "../features/ads/adsSlice";


export default function UserAds() {
  const dispatch = useDispatch();
 const { ads, isLoading, isError, message } = useSelector(state => state.ads);
 const adsList = ads.Ads || [] 
  const { user, } = useSelector(state => state.auth)

  console.log(ads)
  console.log(user.id)

  useEffect(() => {
    if (user.id) {
      dispatch(getAdsbyUser(user.id));
    }
  }, [user.id, dispatch]);

  if (isLoading) return <p>Loading...</p>;


  if (!ads || ads.length === 0) return <p>No ads available</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Ads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adsList.map((ad) => (
          <div key={ad._id} className="border rounded-lg p-4 shadow">
            <img
              src={`http://localhost:5000/uploads/${ad.images[0]}`}
              alt={ad.title}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{ad.title}</h3>
            <p className="text-sm text-gray-600">{ad.price} MAD</p>
            <p className="text-sm">{ad.description?.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
>>>>>>> c2f44a0fd71d8c2362fef7d8850cd89c45e18553
    </div>
  );
}
