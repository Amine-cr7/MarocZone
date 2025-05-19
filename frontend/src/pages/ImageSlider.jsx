// ImageSlider.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageSlider = ({ images, title }) => {
  // If no images or single image, render simple image
  if (!images || images.length === 0) {
    return <NoImagePlaceholder />;
  }

  if (images.length === 1) {
    return (
      <img
        src={`http://localhost:5000/uploads/${images[0]}`}
        alt={title}
        className="h-48 w-full object-cover"
      />
    );
  }

  // Multiple images - use slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: false,
    lazyLoad: 'ondemand',
    dotsClass: "slick-dots custom-dots",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul className="absolute bottom-2 m-0 p-0 w-full flex justify-center"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2 h-2 mx-1 rounded-full bg-white bg-opacity-70 hover:bg-orange-500"></div>
    )
  };

  return (
    <Slider {...sliderSettings} className="h-48">
      {images.map((image, index) => (
        <div key={index} className="h-48">
          <img
            src={`http://localhost:5000/uploads/${image}`}
            alt={`${title} - ${index}`}
            className="h-48 w-full object-cover"
          />
        </div>
      ))}
    </Slider>
  );
};

// No Image Placeholder Component
const NoImagePlaceholder = () => (
  <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
    <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

// Custom Arrow Components
const NextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} rounded-full bg-white bg-opacity-80 shadow-md p-1 hover:bg-orange-100 transition-all`}
    style={{ 
      ...style, 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      right: "12px",
      zIndex: 1
    }}
    onClick={onClick}
  />
);

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} rounded-full bg-white bg-opacity-80 shadow-md p-1 hover:bg-orange-100 transition-all`}
    style={{ 
      ...style, 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      left: "12px",
      zIndex: 1
    }}
    onClick={onClick}
  />
);

export default ImageSlider;