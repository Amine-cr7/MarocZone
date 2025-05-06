import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, setSelectedSubcategory } from '../../features/category/catSlice';
import { setFormData } from '../../features/ads/adsSlice';

export default function CategorySelect() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);
  const { form } = useSelector(state => state.ads);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubcatLabel, setSelectedSubcatLabel] = useState(form.subCat ? form.subCat : "Select SubCategory");
  const [selectedParentIndex, setSelectedParentIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSelectSubcategory = (subcategory) => {
    setSelectedSubcatLabel(subcategory.name);
    dispatch(setSelectedSubcategory(subcategory));
    dispatch(setFormData({ subCat: subcategory.name }));
    setIsOpen(false);
    setSelectedParentIndex(null);
    setError(''); // clear error when selected
  };

  const handleClose = () => {
    if (!form.subCat) {
      setError('Please select a subcategory.');
    } else {
      setError('');
    }
    setIsOpen(false);
    setSelectedParentIndex(null);
  };

  return (
    <div className="p-6 space-y-4">
      <label className="block text-orange-600 text-lg font-semibold">Category</label>

      <div>
        <div
          className={`rounded-lg p-3 bg-white cursor-pointer shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200 
          border ${error ? 'border-red-500' : 'border-orange-300'}`}
          onClick={() => categories.length > 0 && setIsOpen(true)}
        >
          <span className={`font-medium ${selectedSubcatLabel === 'Select SubCategory' ? 'text-gray-400' : 'text-gray-800'}`}>
            {selectedSubcatLabel}
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
          <div className="bg-white w-80 max-w-sm p-4 h-full z-50 overflow-y-auto rounded-l-xl shadow-xl transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              {selectedParentIndex !== null ? (
                <button
                  onClick={() => setSelectedParentIndex(null)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  ← Back
                </button>
              ) : (
                <h2 className="text-lg font-semibold text-gray-800">Select a Category</h2>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 text-xl hover:text-red-500"
              >
                ×
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-500">No categories available.</p>
            ) : selectedParentIndex === null ? (
              <ul>
                {categories.map((cat, idx) => (
                  <li
                    key={cat.id || idx}
                    className="p-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center rounded"
                    onClick={() => setSelectedParentIndex(idx)}
                  >
                    <span className="text-gray-800">{cat.name}</span>
                    {cat.subcategories?.length > 0 && (
                      <span className="text-orange-400">›</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {categories[selectedParentIndex]?.subcategories?.map((sub, idx) => (
                  <li
                    key={sub.id || idx}
                    className="p-3 hover:bg-orange-50 cursor-pointer rounded text-gray-800"
                    onClick={() => handleSelectSubcategory(sub)}
                  >
                    {sub.name}
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
