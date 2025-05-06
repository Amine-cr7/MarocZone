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
    </div>
  );
}
