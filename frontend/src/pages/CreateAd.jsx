import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import BrandModelSelect from './BrandModelSelect';

import DynamicFormFields from './DynamicFormFields'; 

export default function CreateAd() {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    setStep(step + 1);
  };

  const handleDynamicFormSubmit = (formData) => {
    console.log("Final Form Data", {
      subcategory: selectedSubcategory.name,
      brandModel: selectedModel,
      ...formData
    });
    // هنا تقدر تصيفطهم للباك
  };

  return (
    <div className="p-8 space-y-6">
      {step === 1 && (
        <CategorySelect
          setSelectedSubcategory={setSelectedSubcategory}
        />
      )}

      {step === 2 && selectedSubcategory && (
        <BrandModelSelect
          subcategory={selectedSubcategory}
          setSelectedModel={setSelectedModel}
        />
      )}

      {step === 3 && selectedModel && (
        <DynamicFormFields
          subcategory={selectedSubcategory}
          onSubmit={handleDynamicFormSubmit}
        />
      )}

      {step < 3 && (
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Continuer
        </button>
      )}
    </div>
  );
}

