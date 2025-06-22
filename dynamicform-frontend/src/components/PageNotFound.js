import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back later!
        </p>
        <Link to="/" className="btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;