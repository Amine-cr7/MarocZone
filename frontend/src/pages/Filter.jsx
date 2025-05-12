import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterAds, setFormData } from "../features/ads/adsSlice";
import { getCategories, setSelectedSubcategory } from "../features/category/catSlice";

export default function Filter() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const [category, setCategory] = useState("");
  const [subCat, setSubCat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [error, setError] = useState("");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      filterAds({
        category,
        subCat,
        minPrice,
        maxPrice,
        location,
        dateFrom,
        dateTo,
      })
    );
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCat(""); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (e) => {
    setSubCat(e.target.value);
    dispatch(setSelectedSubcategory(e.target.value));
    dispatch(setFormData({ subCat: e.target.value }));
    setError("");
  };

  const handleReset = () => {
    setCategory("");
    setSubCat("");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setDateFrom("");
    setDateTo("");
    setError("");
  };

  const toggleFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Filter Results</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Categories Section */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection - Only shown if a category is selected */}
            {category && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  value={subCat}
                  onChange={handleSubcategoryChange}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((cat) => cat.name === category)
                    ?.subcategories?.map((sub , index) => (
                      <option key={index} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>
            )}
          </div>

          {/* Toggle Additional Filters */}
          <button
            type="button"
            onClick={toggleFilters}
            className="w-full flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-700 focus:outline-none"
          >
            <span>{isFiltersExpanded ? "Hide" : "Show"} Additional Filters</span>
            <svg 
              className={`ml-2 h-5 w-5 transform transition-transform ${isFiltersExpanded ? "rotate-180" : ""}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Additional Filters - Conditionally Rendered */}
          {isFiltersExpanded && (
            <div className="space-y-4 pt-2">
              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter location"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}