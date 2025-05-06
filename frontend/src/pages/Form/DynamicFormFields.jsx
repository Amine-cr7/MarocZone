import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAd, setFormData, setStep } from '../../features/ads/adsSlice';

export default function DynamicFormFields() {
  const dispatch = useDispatch();
  const { form, step } = useSelector(state => state.ads);
  const { subcategory } = useSelector(state => state.categories);

  if (!subcategory.fields) {
    return <div className="text-gray-500">Pas de champs pour cette sous-catégorie.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ 
      details: { 
        ...form.details, 
        [name]: value 
      } 
    }));
  };

  const handleContinue = () => {
    dispatch(createAd(form))
    dispatch(setStep(step + 1));
  };

  const handlePrevious = () => {
    dispatch(setStep(step - 1));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-orange-600 mb-4">More Details</h2>

      {/* Dynamic Fields */}
      {subcategory.fields.map((field, idx) => (
        <div key={idx}>
          <label className="block text-sm font-semibold text-orange-600 mb-2">
            {field.label}
          </label>

          {field.type === 'select' ? (
            <select
              name={field.name}
              value={form.details?.[field.name] || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 border-orange-200"
            >
              <option value="">-- Sélectionner {field.label} --</option>
              {field.options.map((opt, idx2) => (
                <option key={idx2} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={form.details?.[field.name] || ''}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full px-4 py-3 border rounded-lg text-gray-700 transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 border-orange-200"
            />
          )}
        </div>
      ))}

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
}
