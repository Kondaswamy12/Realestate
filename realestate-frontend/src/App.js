import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Buildings from './components/Buildings';
import Guides from './components/Guides';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Alert from './components/Alert'; // ✅ Alert import

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-black">
        {/* Navbar */}
        <Navbar />

        {/* Alert Component */}
        <Alert />

        {/* Page Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
