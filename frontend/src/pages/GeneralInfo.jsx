import React, { useState } from 'react';

const GeneralInfo = ({ getUserData, step, setStep }) => {
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleContinue = () => {
    setStep(step + 1);
    getUserData(formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow space-y-5">

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Continue
      </button>
    </div>
  );
};

export default GeneralInfo;
