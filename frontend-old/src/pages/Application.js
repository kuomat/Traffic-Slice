import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import AppWarnings from '../components/AppWarnings';

function Application() {
    const { app } = useParams()

    return (
    <div className="App">
        <Header />
        <AppWarnings app={app}/>
        <Footer />
    </div>
    );
    }

export default Application;