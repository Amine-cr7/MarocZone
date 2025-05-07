
import CategorySelect from './Form/CategorySelect';
import BrandModelSelect from './Form/BrandModelSelect';

import DynamicFormFields from './Form/DynamicFormFields';
import GeneralInfo from './Form/GeneralInfo';
import AdsInfo from './Form/AdsInfo';
import { useSelector } from 'react-redux';
import AddImage from './Form/AddImage';

export default function CreateAd() {
  const {step} = useSelector(state => state.ads)
  
  return (
    <div className="p-8 space-y-6">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Ad</h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <CategorySelect />

            <hr className="border-t border-orange-100" />
            <GeneralInfo/>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ad Details</h2>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 space-y-6">
              <BrandModelSelect/>

              <hr className="border-t border-orange-100" />

              <AdsInfo/>
            </div>
          </div>
        </>
      )}


      {step === 3  && (
        <DynamicFormFields/>
      )}
      {step === 4 && (
        <AddImage />
      )}
    </div>
  );
}
