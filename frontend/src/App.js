import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Application from './pages/Application';
import About from './pages/About'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the main page route */}
        <Route path="/" element={<Dashboard />} />
        {/* Define the about page route */}
        <Route path="/about" element={<About/>} />
        {/* Define the dynamic route for application page */}
        <Route path="/application/:application" element={<Application />} />
      </Routes>
    </Router>
  );
};

export default App;
