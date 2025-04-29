import React, { useState } from 'react';

export default function DynamicFormFields({ subcategory, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    subcategory.fields.forEach(field => {
      initialData[field.name] = '';
    });
    return initialData;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // send data to parent
  };

  if (!subcategory.fields) {
    return <div className="text-gray-500">Pas de champs pour cette sous-catégorie.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {subcategory.fields.map((field, idx) => (
        <div key={idx}>
          <label className="block text-gray-700 mb-1 font-medium">{field.label}</label>

          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
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
              required={field.required}
              className="border rounded p-2 w-full"
            />
          )}
        </div>
      ))}

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Envoyer
      </button>
    </form>
  );
}
