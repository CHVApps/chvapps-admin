import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setShowNavbar(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'}`} ref={navRef}>
      <div className="navbar-container">
        <div className="logo-container">
          <img src="/images/logo1.webp" alt="Logo" className="logo" />
        </div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}>Home</Link>
          <Link to="/add-item" className={isActive('/add-item') ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleLinkClick('/add-item'); }}>Add Item</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
