import React from 'react';
import Header from '../components/Header';
//import WarningsSection from '../components/Warnings';
import Footer from '../components/Footer';
import HomeWarnings from '../components/HomeWarnings';

function Dashboard() {
  return (
    <div className="App">
      <Header />
      {/* <WarningsSection /> */}
      <HomeWarnings/>
      <Footer />
    </div>
  );
}

export default Dashboard;
