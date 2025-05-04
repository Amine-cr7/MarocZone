import React, { useEffect } from 'react';
import { getAdById } from '../features/ads/adsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const AdDetails = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const { ad, isLoading, isError, message } = useSelector(state => state.ads);

  useEffect(() => {
    dispatch(getAdById(_id));
  }, [dispatch, _id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {message || "Something went wrong!"}</div>;
  }

  if (!ad) {
    return <div>No ad found for the ID: {_id}</div>;
  }

  return (
    <div>
      {ad.images?.length > 0 && (
        <img
          src={`http://localhost:5000/uploads/${ad.images[0]}`}
          className="card-img-top"
          alt={ad.title}
        />
      )}
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>Price: ${ad.price}</p>
      <p>Location: {ad.location}</p>
      <p>Views: {ad.views}</p>
    </div>
  );
};

export default AdDetails;