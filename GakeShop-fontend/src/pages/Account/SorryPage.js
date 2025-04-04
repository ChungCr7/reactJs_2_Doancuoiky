import React from "react";

const SorryPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">500 - Internal Server Error</h1>
      <p className="text-lg text-gray-600">Something went wrong. Please try again later.</p>
    </div>
  );
};

export default SorryPage;
