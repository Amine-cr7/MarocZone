import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchedAds, clearSearchedAds, getAllads } from '../features/ads/adsSlice';
import { Link } from "react-router-dom";
import Search from './Search';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Css/Home.css'


const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const { ads, isLoading, isError, isSuccess, message, searchedAds } = useSelector(state => state.ads);

  const adsToDisplay = searchedAds.length ? searchedAds : ads;
  
  useEffect(() => {
    dispatch(getAllads());
  }, [dispatch]);

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
          {adsToDisplay.map(ad => {
            const sliderSettings = {
              dots: true,
              infinite: true,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
              adaptiveHeight: true,
              ...(ad.images && ad.images.length > 1 ? {
                nextArrow: <NextArrow />,
                prevArrow: <PrevArrow />
              } : { arrows: false })
            };

            return (
              <div key={ad._id} className="card" style={{ width: '25rem', position: 'relative' }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  {ad.images && ad.images.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {ad.images.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:5000/uploads/${image}`}
                            className="card-img-top"
                            alt={`${ad.title} - ${index}`}
                            style={{ 
                              height: '180px', 
                              width: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div style={{ height: '180px', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
                      <span>No images available</span>
                    </div>
                  )}
                </div>

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
            );
          })}
        </div>
      </div>
    </>
  );
}