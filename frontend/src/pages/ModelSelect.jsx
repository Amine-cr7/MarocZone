import React from 'react';

export default function ModelSelect({ brand, selectedModel, setSelectedModel }) {
    if (!brand) return null;

    return (
        <div>
            <label className="block text-gray-800 text-lg mb-2 font-semibold">Modèle</label>
            <select
                className="border rounded-lg p-3 w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedModel || ""}
                onChange={(e) => setSelectedModel(e.target.value)}
            >
                <option value="" disabled>Sélectionner un modèle</option>
                {brand.models.map((model, idx) => (
                    <option key={idx} value={model}>
                        {model}
                    </option>
                ))}
            </select>
        </div>
    );
}
