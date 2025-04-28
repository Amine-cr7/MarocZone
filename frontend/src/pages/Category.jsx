import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../features/category/catSlice';

export default function Category({setSelectedBrand}) {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Sélectionner une catégorie");

  const [activeParent, setActiveParent] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);

  const handleSelectBrand = (brandObj) => {
    console.log(setSelectedBrand);
    setSelectedCategory(brandObj.name);
    setSelectedBrand(brandObj);  
    setIsOpen(false);
    setActiveParent(null);
    setActiveSub(null);
    setActiveBrand(null);
  };
  

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 font-sans">
      <div>
        <label className="block text-gray-800 text-lg mb-2 font-semibold">Catégorie</label>
        <div
          className="border rounded-lg p-3 bg-white cursor-pointer shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-gray-700 font-medium">{selectedCategory}</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="bg-white w-80 p-4 shadow-xl h-full z-50 overflow-y-auto rounded-l-lg">
            <div className="flex justify-between items-center mb-4">
              {(activeBrand !== null || activeSub !== null || activeParent !== null) ? (
                <button onClick={() => {
                  if (activeBrand !== null) setActiveBrand(null);
                  else if (activeSub !== null) setActiveSub(null);
                  else if (activeParent !== null) setActiveParent(null);
                }} className="text-sm text-blue-600 hover:underline">← Retour</button>
              ) : (
                <h2 className="text-lg font-semibold text-gray-700">Sélectionner</h2>
              )}
              <button onClick={() => {
                setIsOpen(false);
                setActiveParent(null);
                setActiveSub(null);
                setActiveBrand(null);
              }} className="text-gray-500 text-xl hover:text-red-500">×</button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            )}

            {/* Niveau 1 */}
            {!loading && activeParent === null && (
              <ul>
                {categories.map((cat, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center rounded"
                    onClick={() => setActiveParent(idx)}
                  >
                    <span className="text-gray-700">{cat.name}</span> <span className="text-gray-400">›</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Niveau 2 */}
            {!loading && activeParent !== null && activeSub === null && (
              <ul>
                {categories[activeParent].subcategories.map((sub, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center rounded"
                    onClick={() => {
                      if (sub.brands) setActiveSub(idx);
                      else {
                        setSelectedCategory(sub.name);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="text-gray-700">{sub.name}</span>
                    {sub.brands && <span className="text-gray-400">›</span>}
                  </li>
                ))}
              </ul>
            )}

            {/* Niveau 3 */}
            {!loading && activeSub !== null && (
              <ul>
                {categories[activeParent].subcategories[activeSub].brands.map((brand, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer rounded text-gray-700"
                    onClick={() => handleSelectBrand(brand)}
                  >
                    {brand.name}
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
