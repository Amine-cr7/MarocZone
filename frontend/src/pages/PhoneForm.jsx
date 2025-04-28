import { useState } from "react";

export default function PhoneForm() {
  const [formData, setFormData] = useState({
    storage: "",
    condition: "",
    price: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // submit to backend
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl space-y-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">Ajouter un téléphone</h2>

        {/* Storage Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacité de Stockage</label>
          <div className="flex flex-wrap gap-2">
            {["8 GB", "16 GB", "32 GB", "64 GB", "128 GB", "256 GB", "512 GB"].map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleSelect("storage", size)}
                className={`px-4 py-2 rounded-full border ${
                  formData.storage === size ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Condition Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">État</label>
          <div className="flex flex-wrap gap-2">
            {["Neuf", "Reconditionné", "Bon état", "Pour pièces"].map((state) => (
              <button
                type="button"
                key={state}
                onClick={() => handleSelect("condition", state)}
                className={`px-4 py-2 rounded-full border ${
                  formData.condition === state ? "bg-green-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DH)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'annonce</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texte de l'annonce</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Décrivez votre produit..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Continuer
        </button>

      </form>
    </div>
  );
}
