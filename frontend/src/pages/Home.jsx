import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSearchedAds, clearSearchedAds, getAllads } from '../features/ads/adsSlice'
import { Link } from "react-router-dom"
import Search from './Search'

export default function Home() {
  const dispatch = useDispatch()
  const { ads, isLoading, isError, isSuccess, message, searchedAds } = useSelector(state => state.ads)
  
  // Determine which ads to display - search results or all ads
  const adsToDisplay = searchedAds && searchedAds.length > 0 ? searchedAds : 
                     (Array.isArray(ads) ? ads : 
                     (Array.isArray(ads?.ads) ? ads.ads : []));

  // Load all ads on first render
  useEffect(() => {
    dispatch(getAllads())
  }, [dispatch])

  // Log ads data for debugging
  useEffect(() => {
    console.log("ADS TYPE:", typeof ads)
    console.log("IS ARRAY:", Array.isArray(ads))
    console.log("ADS VALUE:", ads)
    console.log("SEARCHED ADS:", searchedAds)
  }, [ads, searchedAds])

  return (
    <>
      <div className="container py-4">
        <h1 className="mb-4">Home</h1>

        {isLoading && <div className="alert alert-info">Loading...</div>}
        {isError && <div className="alert alert-danger">Error: {message}</div>}
        {isSuccess && adsToDisplay.length === 0 && (
          <div className="alert alert-warning">No ads available.</div>
        )}

        <Search />

        <div className="d-flex flex-wrap gap-4 mt-4 justify-content-start">
          {adsToDisplay.map(ad => (
            <div key={ad._id} className="card" style={{ width: '18rem' }}>
              <img
                src={`http://localhost:5000/uploads/${ad.images[0]}`}
                className="card-img-top"
                alt={ad.title}
                style={{ height: '180px', objectFit: 'cover' }}
              />

              <div className="card-body">
                <h5 className="card-title">{ad.title}</h5>
                <p className="card-text">{ad.description}</p>
                <p className="card-text"><strong>Location:</strong> {ad.location}</p>
                <p className="card-text"><strong>Price:</strong> ${ad.price}</p>

                {ad.details ? (
                  <ul className="card-text list-unstyled">
                    {Object.entries(ad.details).map(([key, value]) => (
                      <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="card-text"><em>No details available</em></div>
                )}

                <p className="card-text"><strong>Views:</strong> {ad.views}</p>

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
      </div>
    </>
  )
}