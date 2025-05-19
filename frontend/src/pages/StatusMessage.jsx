// StatusMessage.js
import React from 'react';

const StatusMessage = ({ isLoading, isError, isSuccess, message, adsCount }) => {
  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError) {
    return <ErrorMessage message={message} />;
  }

  if (isSuccess && adsCount === 0) {
    return <NoResultsMessage />;
  }

  return null;
};

// Loading Message Component
const LoadingMessage = () => (
  <div className="w-full bg-blue-50 text-blue-700 p-4 rounded-lg shadow-sm mb-6 flex items-center">
    <LoadingSpinner />
    Loading listings...
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="w-full bg-red-50 text-red-700 p-4 rounded-lg shadow-sm mb-6">
    <div className="flex">
      <div className="flex-shrink-0">
        <ErrorIcon />
      </div>
      <div className="ml-3">
        <p className="text-sm">Error: {message}</p>
      </div>
    </div>
  </div>
);

// No Results Message Component
const NoResultsMessage = () => (
  <div className="w-full bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow-sm mb-6">
    <div className="flex">
      <div className="flex-shrink-0">
        <WarningIcon />
      </div>
      <div className="ml-3">
        <p className="text-sm">No listings available at this time.</p>
      </div>
    </div>
  </div>
);

// Icon Components
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ErrorIcon = () => (
  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = () => (
  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default StatusMessage;