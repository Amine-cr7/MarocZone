import React, { useState } from 'react';
import ModelSelect from './ModelSelect';
import Category from './Category';
import PhoneForm from './PhoneForm';

export default function CreateAd() {
    const [selectedBrand, setSelectedBrand] = useState();
    const [selectedModel, setSelectedModel] = useState(null);
    const [step, setStep] = useState(1)
    const handleContinue = () => {
        setStep(step + 1)
    }

    return (
        <div className="p-8 space-y-6">
            {step === 1 && (
                <Category
                    setSelectedBrand={setSelectedBrand}
                />
            )}
            {step === 2 && selectedBrand && (
                <>
                    <ModelSelect
                        selectedModel={selectedModel}
                        brand={selectedBrand}
                        setSelectedModel={setSelectedModel}
                    />
                    <PhoneForm />
                </>
            )}

            <button onClick={handleContinue}>Continue</button>
        </div>
    );
}
