import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPhotos, setStep } from '../../features/ads/adsSlice';
import { useNavigate } from 'react-router-dom';

export default function AddImage() {
  const { ad, step } = useSelector(state => state.ads);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setError(''); // Clear error when new images are selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    images.forEach(img => formData.append('files', img));

    dispatch(uploadPhotos({ id: ad._id, photos: formData }));
    setStep(1)
    navigate('/');
  };

  const handlePrevious = () => {
    dispatch(setStep(step - 1));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-orange-600 text-center">Upload Images for Your Ad</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-orange-300 rounded-lg cursor-pointer bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden shadow-md">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            className="w-full py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
          >
            Previous
          </button>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
          >
            Upload Images
          </button>
        </div>
      </form>
    </div>
  );
}
