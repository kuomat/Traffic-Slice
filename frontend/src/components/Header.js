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
    navigate('/about');
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-lg mx-5 my-5 shadow-xl">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer px-8 py-4 hover:bg-red-600 rounded-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105"
        >
          <i className="fas fa-home text-4xl mb-1"></i>
          <p className="text-sm">Home</p>
        </button>

        {/* About Button */}
        <button
          onClick={handleAboutClick}
          className="flex flex-col items-center bg-transparent border-none cursor-pointer px-8 py-4 hover:bg-red-600 rounded-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105"
        >
          <i className="fas fa-info-circle text-4xl mb-1"></i>
          <p className="text-sm">About</p>
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white font-sans tracking-wide flex-grow">Traffic Slice</h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 px-1">
          <input
            type="text"
            placeholder="Search..."
            className="p-3 rounded-l-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-red-300 text-lg font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-3 rounded-r-lg border border-gray-300 hover:bg-red-600 transition-all duration-300 text-lg font-semibold transform hover:scale-105"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
