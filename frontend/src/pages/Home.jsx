import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllads } from '../features/ads/adsSlice'
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch()
  const { ads, isLoading, isError, isSuccess, message } = useSelector(state => state.ads)

  useEffect(() => {
    dispatch(getAllads())
  }, [dispatch])

  const adsList = ads.ads || []
  console.log(adsList)

  return (
    <>
      <div>Home</div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {message}</div>}
      {isSuccess && adsList.length === 0 && <div>No ads available.</div>}

      <div>
        {adsList.map(ad => (
          <div key={ad._id} className="card" style={{ width: '18rem' }}>
            <img
              src={`http://localhost:5000/uploads/${ad.images[0]}`}
              className="card-img-top"
              alt={ad.title}
            />

            <div className="card-body">
              <h5 className="card-title">{ad.title}</h5>
              <h5 className="card-title"> test {ad._id}</h5>
              <p className="card-text">{ad.description}</p>
              <p className="card-text">Price: ${ad.price}</p>
              <p className="card-text">Location: {ad.location}</p>
              <p className="card-text">Views: {ad.views}</p>
              <Link
                to={`/ads/${ad._id}`}
                className="btn btn-primary w-100 stretched-link"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
