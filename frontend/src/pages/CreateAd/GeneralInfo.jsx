import React, { useEffect, useState } from 'react';

const GeneralInfo = ({ getUserData, step, setStep, selectedSubcategory, finalData ,setCatErr}) => {
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Pre-fill form if finalData exists
  useEffect(() => {
    if (finalData) {
      setFormData({
        location: finalData.location || '',
        phone: finalData.phone || '',
      });
    }
  }, [finalData]);

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s\-]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    if (!selectedSubcategory) {
      newErrors.category = 'Please select a category.';
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Track field focus loss to show inline errors
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  // Handle form submission
  const handleContinue = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ location: true, phone: true });
    if (!selectedSubcategory) {
      setCatErr(true);
    } else {
      setCatErr(false);
    }
    if (Object.keys(validationErrors).length === 0) {
      getUserData(formData);
      setStep(step + 1);
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
          value={formData.location}
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
          value={formData.phone}
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
