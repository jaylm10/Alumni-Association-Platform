import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import {
  Menu,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextProvider";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { role } = useContext(AuthContext); // You already have the role here
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Also clear the user object that holds the role
    localStorage.removeItem("user"); 
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // --- NEW FUNCTION TO HANDLE PROFILE NAVIGATION ---
  const handleProfileNavigation = () => {
    // Check the role from the context
    if (role === 'student') {
      navigate('/student-profile');
    } else if (role === 'alumni') {
      navigate('/alumni-profile');
    } else {
      // Fallback in case the role isn't loaded yet or is invalid
      console.error("User role not found, cannot navigate to profile.");
      // You could navigate to a default dashboard or show a toast notification here
      navigate('/'); 
    }
    setDropdownOpen(false); // Close dropdown after clicking
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="/" className="logo-link">
              <div className="logo-icon">
                <span>AC</span>
              </div>
              <span className="logo-text">Alumni Connect</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/alumni" className="nav-link">Alumni</a>
            <a href="/jobs" className="nav-link">Jobs</a>
            <a href="/events" className="nav-link">Events</a>
            <a href="/about" className="nav-link">About</a>
          </nav>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {!isLoggedIn ? (
              <>
                <a href="/login" className="btn btn-login">Login</a>
                <a href="/userTypeSelection" className="btn btn-register">Register</a>
              </>
            ) : (
              <div className="profile-dropdown-container">
                <button onClick={toggleDropdown} className="profile-btn">
                  <UserCircle className="profile-icon" />
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {/* --- UPDATED PROFILE LINK --- */}
                    {/* This is now a button that calls our new function */}
                    <button onClick={handleProfileNavigation} className="dropdown-item">
                      Profile
                    </button>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-toggle">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-menu"
            >
              <Menu className="menu-icon" />
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <a href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Home</a>
              <a href="/alumni" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Alumni</a>
              <a href="/jobs" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Jobs</a>
              <a href="/events" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Events</a>
              <a href="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">About</a>
              <div className="mobile-auth">
                <a href="/login" onClick={() => setMobileMenuOpen(false)} className="btn mobile-btn-login">Login</a>
                <a href="/register" onClick={() => setMobileMenu-Open(false)} className="btn mobile-btn-register">Register</a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
