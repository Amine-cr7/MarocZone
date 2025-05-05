import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import BrandModelSelect from './BrandModelSelect';

import DynamicFormFields from './DynamicFormFields';
import GeneralInfo from './GeneralInfo';
import AdsInfo from './AdsInfo';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ads/adsSlice';
import AddImage from './AddImage';

export default function CreateAd() {
  const [catErr,setCatErr] = useState("")
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Ad</h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <CategorySelect catErr={catErr} oldCat={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory} />

            <hr className="border-t border-orange-100" />

            <GeneralInfo
              finalData={finalData}
              selectedSubcategory={selectedSubcategory}
              setStep={setStep}
              setCatErr={setCatErr}
              step={step}
              getUserData={getUserData}
            />
          </div>
        </>
      )}

      {step === 2 && selectedSubcategory && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ad Details</h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 space-y-6">
              <BrandModelSelect
                subcategory={selectedSubcategory}
                setSelectedBrand={setSelectedBrand}
                setSelectedModel={setSelectedModel}
              />

              <hr className="border-t border-orange-100" />

              <AdsInfo
                step={step}
                setStep={setStep}
                getAdData={getAdData}
              />
            </div>
          </div>
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
        <AddImage />
      )}
    </div>
  );
}
