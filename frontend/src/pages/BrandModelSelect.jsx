import React, { useState } from 'react';

export default function BrandModelSelect({ subcategory, setSelectedModel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Sélectionner une marque');
  const [activeBrand, setActiveBrand] = useState(null);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedLabel(model);
    setIsOpen(false);
    setActiveBrand(null);
  };

  if (!subcategory || !subcategory.brands) {
    return <div className="text-gray-500">Aucune marque disponible pour cette sous-catégorie.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 font-sans">
      <div>
        <label className="block text-gray-800 text-lg mb-2 font-semibold">Marque / Modèle</label>
        <div
          className="border rounded-lg p-3 bg-white cursor-pointer shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-gray-700 font-medium">{selectedLabel}</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="bg-white w-80 p-4 shadow-xl h-full z-50 overflow-y-auto rounded-l-lg">
            <div className="flex justify-between items-center mb-4">
              {activeBrand !== null ? (
                <button onClick={() => setActiveBrand(null)} className="text-sm text-blue-600 hover:underline">← Retour</button>
              ) : (
                <h2 className="text-lg font-semibold text-gray-700">Sélectionner</h2>
              )}
              <button onClick={() => {
                setIsOpen(false);
                setActiveBrand(null);
              }} className="text-gray-500 text-xl hover:text-red-500">×</button>
            </div>

            {/* Niveau 1 : Marques */}
            {activeBrand === null && (
              <ul>
                {subcategory.brands.map((brand, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center rounded"
                    onClick={() => {
                      if (brand.models && brand.models.length > 0) {
                        setActiveBrand(idx);
                      } else {
                        handleModelSelect(brand.name);
                      }
                    }}
                  >
                    <span className="text-gray-700">{brand.name}</span>
                    {brand.models && brand.models.length > 0 && (
                      <span className="text-gray-400">›</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Niveau 2 : Modèles */}
            {activeBrand !== null && (
              <ul>
                {subcategory.brands[activeBrand].models.map((model, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer rounded text-gray-700"
                    onClick={() => handleModelSelect(model)}
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
