import React, { useState } from 'react';

export default function DynamicFormFields({ subcategory }) {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    subcategory.fields?.forEach(field => {
      initialData[field.name] = '';
    });
    return initialData;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFakeSubmit = () => {
    console.log("Form bidon soumis, données ignorées :", formData);
    alert("Ceci est un formulaire bidon. Les données ne sont pas envoyées.");
  };

  if (!subcategory.fields) {
    return <div className="text-gray-500">Pas de champs pour cette sous-catégorie.</div>;
  }

  return (
    <div className="space-y-6">
      {subcategory.fields.map((field, idx) => (
        <div key={idx}>
          <label className="block text-gray-700 mb-1 font-medium">{field.label}</label>

          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            >
              <option value="">-- Sélectionner {field.label} --</option>
              {field.options.map((opt, idx2) => (
                <option key={idx2} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleFakeSubmit}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Simuler l’envoi
      </button>
    </div>
  );
}
