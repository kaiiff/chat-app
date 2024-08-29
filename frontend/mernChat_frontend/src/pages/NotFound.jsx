import React from "react";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back to Home
      </a>
    </div>
  );
}

export default NotFoundPage;
