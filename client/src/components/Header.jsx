import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import { Menu, UserCircle, ChevronDown, LogOut, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextProvider";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Cleaned up: get user and role from the same context
  const { user } = useContext(AuthContext);
  const {role} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    window.location.href = "/login"; // Full refresh to clear all state
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileNavigation = () => {
    const path = role === "student" ? "/student-profile" : "/alumni-profile";
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        
        {/* Logo */}
        <a href="/" className="navbar__logo">
          <div className="navbar__logo-icon"><span>AC</span></div>
          <span className="navbar__logo-text">Alumni Connect</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar__links">
          <a href="/" className="navbar__link">Home</a>
          <a href="/alumni" className="navbar__link">Alumni</a>
          {role === "alumni" && <a href="/students" className="navbar__link">Students</a>}
          <a href="/jobs" className="navbar__link">Jobs</a>
          <a href="/events" className="navbar__link">Events</a>
          <a href="/about" className="navbar__link">About</a>
        </nav>

        {/* Actions (Login/Register or Profile Dropdown) */}
        <div className="navbar__actions">
          {!isLoggedIn ? (
            <div className="navbar__auth-buttons">
              <a href="/login" className="btn btn--secondary">Login</a>
              <a href="/userTypeSelection" className="btn btn--primary">Register</a>
            </div>
          ) : (
            <div className="navbar-dropdown">
              <button onClick={toggleDropdown} className="navbar-dropdown__toggle">
                {user && user.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="Profile" className="navbar-dropdown__user-avatar" />
                ) : (
                  <UserCircle className="navbar-dropdown__user-icon" />
                )}
                <ChevronDown size={18} className={`navbar-dropdown__chevron ${dropdownOpen ? 'is-open' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown__menu">
                  <button onClick={handleProfileNavigation} className="navbar-dropdown__item">
                    <User size={16} /> My Profile
                  </button>
                  <a href="/messages" className="navbar-dropdown__item" onClick={() => setDropdownOpen(false)}>
                    <MessageSquare size={16} /> Messages
                  </a>
                  <div className="navbar-dropdown__separator"></div>
                  <button onClick={handleLogout} className="navbar-dropdown__item navbar-dropdown__item--logout">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="navbar__mobile-toggle">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu">
          <a href="/" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="/alumni" onClick={() => setMobileMenuOpen(false)}>Alumni</a>
          {role === 'alumni' && <a href="/students" onClick={() => setMobileMenuOpen(false)}>Students</a>}
          <a href="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</a>
          <a href="/events" onClick={() => setMobileMenuOpen(false)}>Events</a>
          <a href="/about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <div className="navbar-dropdown__separator"></div>
          
          {isLoggedIn ? (
            <>
              <button onClick={() => { handleProfileNavigation(); setMobileMenuOpen(false); }}>My Profile</button>
              <a href="/messages" onClick={() => setMobileMenuOpen(false)}>Messages</a>
              <button onClick={handleLogout} className="navbar-dropdown__item--logout">Logout</button>
            </>
          ) : (
            <div className="navbar__mobile-auth">
              <a href="/login" className="btn btn--secondary">Login</a>
              <a href="/userTypeSelection" className="btn btn--primary">Register</a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

