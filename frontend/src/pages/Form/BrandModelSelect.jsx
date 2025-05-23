import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFormData } from '../../features/ads/adsSlice';

export default function BrandModelSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { subcategory } = useSelector(state => state.categories);
  const { form } = useSelector(state => state.ads);
  const dispatch = useDispatch();

  const [selectedLabel, setSelectedLabel] = useState(form.brand || form.model ? `${form.brand} - ${form.model}` : "Select Model/Brand");
  const [activeBrandIndex, setActiveBrandIndex] = useState(null);
  const [error, setError] = useState('');

  const handleSelect = (brand, model = null) => {
    if (model) {
      dispatch(setFormData({ model, brand: brand.name }));
      setSelectedLabel(`${brand.name} - ${model}`);
    } else {
      dispatch(setFormData({ brand: brand.name }));
      setSelectedLabel(brand.name);
    }
    setIsOpen(false);
    setActiveBrandIndex(null);
    setError('');  // clear error on valid select
  };

  const handleClose = () => {
    if (!form.brand) {
      setError('Please select a brand or model.');
    } else {
      setError('');
    }
    setIsOpen(false);
    setActiveBrandIndex(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-orange-600 text-lg font-semibold">Brand / Model</label>

      <div>
        <div
          className={`border rounded-lg p-3 bg-white cursor-pointer shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200
            ${error ? 'border-red-500' : 'border-orange-300'}`}
          onClick={() => subcategory?.brands?.length > 0 && setIsOpen(true)}
        >
          <span className={`font-medium ${selectedLabel === 'Select Model/Brand' ? 'text-gray-400' : 'text-gray-800'}`}>
            {selectedLabel}
          </span>
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="bg-white w-80 max-w-sm p-4 h-full z-50 overflow-y-auto rounded-l-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              {activeBrandIndex !== null ? (
                <button
                  onClick={() => setActiveBrandIndex(null)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  ← Back
                </button>
              ) : (
                <h2 className="text-lg font-semibold text-gray-800">Select a Brand</h2>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 text-xl hover:text-red-500"
              >
                ×
              </button>
            </div>

            {/* Brands */}
            {activeBrandIndex === null ? (
              <ul>
                {subcategory?.brands?.map((brand, idx) => (
                  <li
                    key={idx}
                    className="p-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center rounded"
                    onClick={() => {
                      if (brand.models?.length > 0) {
                        setActiveBrandIndex(idx);
                      } else {
                        handleSelect(brand);
                      }
                    }}
                  >
                    <span className="text-gray-800">{brand.name}</span>
                    {brand.models?.length > 0 && (
                      <span className="text-orange-400">›</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {subcategory.brands[activeBrandIndex].models.map((model, idx) => (
                  <li
                    key={idx}
                    className="p-3 hover:bg-orange-50 cursor-pointer rounded text-gray-800"
                    onClick={() => handleSelect(subcategory.brands[activeBrandIndex], model)}
                  >
                    {model}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
