import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import AppWarnings from '../components/AppWarnings';

function Application() {
    const { application } = useParams()
    console.log("stuff" , application)

    return (
    <>
        <Header />
        <AppWarnings app={application}/>
        <Footer />
    </>
    );
    }

export default Application;