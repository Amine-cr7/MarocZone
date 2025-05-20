import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchedAds,
  clearSearchedAds,
  getAllads,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../features/ads/adsSlice";
import { Link } from "react-router-dom";
import Search from "./Search";
import Filter from "./Filter";
import { toast } from "react-toastify";
import AdCard from "./AdCard";
import StatusMessage from "./StatusMessage";

export default function Home() {
  const dispatch = useDispatch();
  const {
    ads,
    isLoading,
    isError,
    isSuccess,
    message,
    searchedAds,
    AdsFilter,
    favorites,
  } = useSelector((state) => state.ads);

  const [showFilters, setShowFilters] = useState(false);
  const [pendingFavoriteActions, setPendingFavoriteActions] = useState({});

  // Determine which ads to display
  const adsToDisplay =
    searchedAds.length > 0
      ? searchedAds
      : AdsFilter.length > 0
      ? AdsFilter
      : ads;

  const favoriteAds = favorites?.items
  ? favorites.items.map((fav) => fav.ad?._id).filter(Boolean) 
  : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getAllads()).unwrap();
        await dispatch(getFavorites()).unwrap();
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data. Please try again.");
      }
    };

    loadData();
  }, [dispatch]);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleFavoriteClick = async (adId, adTitle) => {
    if (pendingFavoriteActions[adId]) return;

    setPendingFavoriteActions((prev) => ({ ...prev, [adId]: true }));

    const isCurrentlyFavorite = favoriteAds.includes(adId); // Moved up here
    const action = isCurrentlyFavorite ? "remove from" : "add to"; // Pre-determine action

    try {
      if (isCurrentlyFavorite) {
        await dispatch(removeFavorite(adId)).unwrap();
        toast.success(`Removed "${adTitle}" from favorites`);
      } else {
        await dispatch(addFavorite(adId)).unwrap();
        toast.success(`Added "${adTitle}" to favorites`);
      }

      await dispatch(getFavorites()).unwrap();
    } catch (error) {
      console.error("Favorite action error:", error);
      toast.error(
        error.response?.data?.message || `Could not ${action} favorites` // Use pre-determined action
      );
    } finally {
      setPendingFavoriteActions((prev) => ({ ...prev, [adId]: false }));
    }
  };
  console.log("adsToDisplay:", adsToDisplay);
  console.log("favoriteAds:", favoriteAds);
  console.log("pendingFavoriteActions:", pendingFavoriteActions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Browse available listings or find exactly what you're looking for
        </p>
      </div>

      {/* Status Messages */}
      <StatusMessage
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        message={message}
        adsCount={adsToDisplay.length}
      />

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <Search />
          </div>

          <div className="px-6 pb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center w-full py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:outline-none"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Expandable Filter Section */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-6">
              <Filter />
            </div>
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adsToDisplay
          .filter((ad) => ad && ad._id)
          .map((ad) => (
            <AdCard
              key={ad._id}
              ad={ad}
              isFavorite={favoriteAds.includes(ad._id)}
              isPending={pendingFavoriteActions[ad._id]}
              onFavoriteClick={handleFavoriteClick}
            />
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && isSuccess && adsToDisplay.length === 0 && (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No listings found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
