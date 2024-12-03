// 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission reload
    if (searchQuery.trim()) {
      navigate(`/application/${searchQuery.trim()}`); // Navigate to dynamic route
    }
  };

  const handleHomeClick = () => {
    navigate('/'); // Navigate to the root
  };

  const handleAboutClick = () => {
    navigate('/about')
  }

  return (
    <header className="bg-blue-500 text-white py-4 rounded-lg mx-5 my-5">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer px-12"
        >
          <i className="fas fa-home text-2xl"></i>
          <p className="mt-1 text-sm">Home</p>
        </button>

        {/* About Button */}
        <button
          onClick={handleAboutClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer px-10"
        >
          <i className="fas fa-home text-2xl"></i>
          <p className="mt-1 text-sm">About</p>
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold text-center flex-grow">Traffic Slice</h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center px-1">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded-l-lg border border-gray-300 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-blue-500 px-4 py-2 rounded-r-lg border border-gray-300 hover:bg-gray-200"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
