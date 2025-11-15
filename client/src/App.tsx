import './App.css';
import React from "react";
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar/Navbar'; 
import Cat from './components/pages/Cat/Cat';
import Dog from './components/pages/Dog/Dog';
import Home from './components/pages/Home/Home';
import Fox from './components/pages/Fox/Fox';
import Favorites from './components/pages/Favorites/Favorites';

const App = () => {
  return (
    <>
      <NavBar /> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/cats" element={<Cat />} /> 
        <Route path="/dogs" element={<Dog />} /> 
        <Route path="/fox" element={<Fox />} /> 
        <Route path="/favorites" element={<Favorites />} /> 
      </Routes>
    </>
  );
};

export default App;