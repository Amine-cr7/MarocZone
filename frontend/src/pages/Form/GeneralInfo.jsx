import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, setStep } from '../../features/ads/adsSlice';

const GeneralInfo = () => {
  const dispatch = useDispatch();

  const { form, step } = useSelector(state => state.ads);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
console.log(form)
  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.location.trim()) {
      newErrors.location = 'Location is required.';
    }
    if(!form.subCat){
      newErrors.subCat = true
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^(?:\+212\s?|0)(5|6|7)\d{8}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }

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
    setTouched({ location: true, phone: true });

    if (Object.keys(validationErrors).length === 0) {
      
      dispatch(setStep(step + 1));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Location Field */}
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-orange-600 mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your city or area"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${errors.location && touched.location ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.location && touched.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-orange-600 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., +1 234 567 890"
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${errors.phone && touched.phone ? 'border-red-500' : 'border-orange-200'}`}
        />
        {errors.phone && touched.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Continue to Next Step
      </button>
    </div>
  );
};

export default GeneralInfo;
