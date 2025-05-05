
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAdById, updateAd } from '../features/ads/adsSlice';
import CategorySelect from './CategorySelect';
import BrandModelSelect from './BrandModelSelect';
import DynamicFormFields from './DynamicFormFields';
import GeneralInfo from './GeneralInfo';
import AdsInfo from './AdsInfo';
import AddImage from './AddImage';

export default function UpdateAd() {
  const { _id } = useParams(); 

  const { user } = useSelector(state => state.auth);
  const { ad, isLoading, isError, message } = useSelector(state => state.ads);



  const [step, setStep] = useState(1);
  const [finalData, setFinalData] = useState({});
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (_id) {
      dispatch(getAdById(_id));
    }
  }, [_id, dispatch]); 

  useEffect(() => {
    if (ad) {
      setSelectedSubcategory(ad.subCat);
      setSelectedModel(ad.model);
      setSelectedBrand(ad.brand);
      setFinalData(ad);
    }
  }, [ad]);
  console.log(ad)
  console.log(ad.subCat)
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
      _id: _id, 
    }));
  };

  const handleDynamicFormSubmit = (formData) => {
    const finalPayload = {
      ...finalData,
      details: formData,
    };
    dispatch(updateAd(finalPayload));console.log(finalPayload)
  };

  console.log(selectedModel)
  console.log(selectedBrand)
  console.log(finalData)
  console.log(step)
  
  return (
    <div className="p-8 space-y-6">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800">Edit Listing</h2>
          <CategorySelect
            setSelectedSubcategory={setSelectedSubcategory}
            initialCategory={selectedSubcategory}

          />
          <GeneralInfo 
            setStep={setStep}
            step={step}
            getUserData={getUserData}
            initialData={{ location: ad.location, phone: ad.phone }}
           />
        </>
      )}

      {step === 2 && selectedSubcategory && (
        <>
          <BrandModelSelect
            subcategory={selectedSubcategory}
            setSelectedBrand={setSelectedBrand}
            setSelectedModel={setSelectedModel}
            initialBrand={selectedBrand}
            initialModel={selectedModel}
          />
          <AdsInfo
            step={step}
            setStep={setStep}
            getAdData={getAdData}
            initialData={finalData}
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

      {step === 4 && <AddImage />}
    </div>
  );
}
