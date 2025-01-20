import React from 'react';
import Header from '../components/Header';
import WarningsSection from '../components/Warnings';
import Footer from '../components/Footer';

function Dashboard() {
  return (
    <div className="App">
      <Header />
      <WarningsSection />
      <Footer />
    </div>
  );
}

export default Dashboard;
