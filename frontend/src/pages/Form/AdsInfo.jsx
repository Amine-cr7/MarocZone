import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, setStep } from '../../features/ads/adsSlice';

const AdsInfo = () => {
  const dispatch = useDispatch();

  const { form, step } = useSelector(state => state.ads);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  console.log(form)

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.price || isNaN(form.price)) newErrors.price = 'Valid price is required.';
    if (!form.model ) newErrors.model = true;
    if (!form.brand ) newErrors.brand = true;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleContinue = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ title: true, description: true, price: true });

    if (Object.keys(validationErrors).length === 0) {
      dispatch(setStep(step + 1));
    }
  };

  const handlePrevious = () => {
    dispatch(setStep(step - 1));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-orange-600 mb-2">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ad title"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${errors.title && touched.title ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.title && touched.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-orange-600 mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          placeholder="Describe your ad"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${errors.description && touched.description ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.description && touched.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-orange-600 mb-2">Price (MAD)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={form.price}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., 1500"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${errors.price && touched.price ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.price && touched.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
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
          className="w-full py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AdsInfo;
