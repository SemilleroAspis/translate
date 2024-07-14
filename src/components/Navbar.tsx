// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/adbountieslogo.svg';
import '../styles/components/Navbar.scss';

const Navbar: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClasses = scrollPosition > 0 ? 'bg-gradient-to-r from-custom-darkPurple to-custom-blue shadow-lg' : 'bg-transparent';

  return (
    <nav className={`navbar fixed w-full z-10 top-0 transition duration-300 ${navbarClasses}`}>
      <div className="container mx-auto flex justify-center items-center p-2">
        <div className="flex items-center space-x-4 text-lg font-semibold">
          <Link to="/" className="navbar-link">Home</Link>
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mx-2" />
          <Link to="/translate" className="navbar-link">Translate</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
