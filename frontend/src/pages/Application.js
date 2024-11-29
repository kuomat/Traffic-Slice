import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';

function Application() {
    const { app } = useParams()

    return (
    <div className="App">
        <Header />
        <Footer />
    </div>
    );
    }

export default Application;