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

  const adDetails = ad.ads || {};

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
      {adDetails.images?.length > 0 && (
        <img
          src={`http://localhost:5000/uploads/${adDetails.images[0]}`}
          className="card-img-top"
          alt={adDetails.title}
        />
      )}
      <h1>{adDetails.title}</h1>
      <p>{adDetails.description}</p>
      <p>Price: ${adDetails.price}</p>
      <p>Location: {adDetails.location}</p>
      <p>Views: {adDetails.views}</p>
    </div>
  );
};

export default AdDetails;
