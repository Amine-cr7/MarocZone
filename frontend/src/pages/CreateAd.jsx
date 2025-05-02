import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import BrandModelSelect from './BrandModelSelect';

import DynamicFormFields from './DynamicFormFields';
import GeneralInfo from './GeneralInfo';
import AdsInfo from './AdsInfo';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../features/ads/adsSlice';
import AddImage from './AddImage';

export default function CreateAd() {
  const { user } = useSelector(state => state.auth)
  
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [step, setStep] = useState(1);
  const [finalData, setFinalData] = useState({});

  const getUserData = (formData) => {
    setFinalData(prev => ({ ...prev, ...formData }));
  };

  const getAdData = (formData) => {
    setFinalData(prev => ({
      ...prev,
      ...formData,
      subCat: selectedSubcategory.name,
      model: selectedModel,
      brand: selectedBrand,
      user: user.id,
    }));
  };

  const dispatch = useDispatch()
  const handleDynamicFormSubmit = (formData) => {
    const finalPayload = {
        ...finalData,
        details: {
            ...formData
        }
    };
    dispatch(createAd(finalPayload));
};
  return (
    <div className="p-8 space-y-6">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800">Add New Listing</h2>

          <CategorySelect
            setSelectedSubcategory={setSelectedSubcategory}
          />
          <GeneralInfo setStep={setStep} step={step} getUserData={getUserData} />
        </>
      )}

      {step === 2 && selectedSubcategory && (
        <>
          <BrandModelSelect

            subcategory={selectedSubcategory}
            setSelectedBrand={setSelectedBrand}
            setSelectedModel={setSelectedModel}
          />
          <AdsInfo
            step={step}
            setStep={setStep}
            getAdData={getAdData}
          />
        </>

      )}

      {step === 3 && selectedModel && (
        <DynamicFormFields
          subcategory={selectedSubcategory}
          onSubmit={handleDynamicFormSubmit}
          step={step}
          setStep={setStep}
        />
      )}
      {step === 4 && (
        <AddImage/>
      )}
    </div>
  );
}
