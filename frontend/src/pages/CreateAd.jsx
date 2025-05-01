import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import BrandModelSelect from './BrandModelSelect';
import DynamicFormFields from './DynamicFormFields'; 
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../features/ads/adsSlice';
import { toast } from 'react-toastify';

export default function CreateAd() {
  const dispatch = useDispatch();


const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user'));
if (!user) {
  
}
const userId = user?.id || user?.data?.id;
console.log('User from localStorage:', user); 
console.log('User from localStorage:', userId); 

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    images: null,
  });

  const [dynamicFormData, setDynamicFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files[0] 
    });
  };

  const handleContinue = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleDynamicFormSubmit = (formData) => {
    setDynamicFormData(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSubcategory || !selectedModel) {
        toast.error('Please select category and model');
        return;
    }

    if (!userId) {
        toast.error('User not authenticated');
        return;
    }

    try {
        const adData = new FormData();
        adData.append('title', formData.title);
        adData.append('description', formData.description);
        adData.append('price', formData.price);
        adData.append('location', formData.location);
        adData.append('user', userId);
        adData.append('brand', selectedBrand);
        adData.append('model', selectedModel);
        adData.append('category', selectedSubcategory.category); 
        console.log(adData)
        
        if (formData.images) {
            adData.append('images', formData.images);
        }

        Object.entries(dynamicFormData).forEach(([key, value]) => {
            adData.append(`details[${key}]`, value);
        });
      

        await dispatch(createAd(adData)).unwrap();
        toast.success('Ad created successfully!');
        setStep(4); 
    } catch (error) {
        console.error('Error creating ad:', error);
        toast.error(error.message || error || 'Failed to create ad');
    }
};

  return (
    <div className="p-8 space-y-6">
      {step < 4 ? (
        <form onSubmit={ (e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-4">
              <div className='form-group'>
                <label className='block text-gray-700 mb-1 font-medium'>Title</label>
                <input
                  type="text"
                  name="title"
                  className='form-control'
                  value={formData.title}
                  onChange={handleChange}
                  required          
                />
              </div>
              <div className='form-group'>
                <label className='block text-gray-700 mb-1 font-medium'>Description</label>
                <textarea
                  name="description"
                  className='form-control'
                  value={formData.description}
                  onChange={handleChange}
                  required            
                />
              </div>
              <div className='form-group'>
                <label className='block text-gray-700 mb-1 font-medium'>Price</label>
                <input
                  type="number"
                  name="price"
                  className='form-control'
                  value={formData.price}
                  onChange={handleChange}            
                />
              </div>
              <div className='form-group'>
                <label className='block text-gray-700 mb-1 font-medium'>Location</label>
                <input
                  type="text"
                  name="location"
                  className='form-control'
                  value={formData.location}
                  onChange={handleChange}            
                />
              </div>
              <div className='form-group'>
                <label className='block text-gray-700 mb-1 font-medium'>Images</label>
                <input
                  type="file"
                  name="images"
                  className='form-control'
                  onChange={handleImageChange}            
                />
              </div>

              <CategorySelect
                setSelectedSubcategory={setSelectedSubcategory}
              />
            </div>
          )}

          {step === 2 && selectedSubcategory && (
            <BrandModelSelect
              subcategory={selectedSubcategory}
              setSelectedBrand={setSelectedBrand}
              setSelectedModel={setSelectedModel}
            />
          )}

          {step === 3 && selectedModel && (
            <DynamicFormFields
              subcategory={selectedSubcategory}
              onSubmit={handleDynamicFormSubmit}
            />
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={step === 1 && !selectedSubcategory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                Continue
              </button>
            ) : (
              <button
                type='button'
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={handleSubmit}
              >
                Submit Ad
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-green-600">Ad Created Successfully!</h2>
          <p>Thank you for submitting your ad.</p>
        </div>
      )}
    </div>
  );
}