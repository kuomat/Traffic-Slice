import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {

    return (
    <div className="App">
        <Header />
        <h1 className="text-center font-bold text-4xl py-3">About us:</h1>
        <div className='center px-10'>The Traffic Slice solution aims to provide transparency without compromising privacy, emphasizing open-source availability to build trust within the user community. By making the code openly accessible, users and developers alike can review the tool's inner workings, ensuring there are no hidden data collection practices or vulnerabilities. This transparency not only helps in identifying potential security issues early but also fosters a collaborative environment where the community can contribute to the tool's improvement.</div>
        <Footer />
    </div>
    );
    }

export default About;