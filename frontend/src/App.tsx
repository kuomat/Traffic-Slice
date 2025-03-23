import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AlertTable from "./components/AlertTable";
import About from "./components/About";

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<AlertTable />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default App;