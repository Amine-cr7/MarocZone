import React, { useState, useEffect } from 'react';

const AdsInfo = ({ getAdData, step, setStep }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleContinue = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      getAdData(formData);
      setStep(step + 1);
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.price &&
    !isNaN(formData.price);

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-orange-600 mb-2">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ad title"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.title ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-orange-600 mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe your ad"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.description ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-orange-600 mb-2">Price (MAD)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 1500"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition ${errors.price ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          className="w-full py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
        >
          Previous
        </button>
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${isFormValid
            ? 'bg-orange-500 hover:bg-orange-600 shadow-md'
            : 'bg-orange-300 cursor-not-allowed opacity-70'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AdsInfo;
