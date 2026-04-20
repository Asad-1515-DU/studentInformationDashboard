import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

/**
 * Navigation Component
 * 
 * Displays main navigation menu with active route highlighting
 * Supports all main sections of the application
 */

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/students';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {/* Logo/Brand */}
        <div className="navigation__brand">
          <Link to="/" className="navigation__logo">
            <span className="navigation__logo-icon">🎓</span>
            <span className="navigation__logo-text">Student Hub</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navigation__menu">
          <Link
            to="/students"
            className={`navigation__link ${isActive('/students') ? 'navigation__link--active' : ''}`}
            title="Student Directory"
          >
            <span className="navigation__link-icon">👥</span>
            <span className="navigation__link-text">Students</span>
          </Link>

          <Link
            to="/scholarships"
            className={`navigation__link ${isActive('/scholarships') ? 'navigation__link--active' : ''}`}
            title="Scholarship Management"
          >
            <span className="navigation__link-icon">💰</span>
            <span className="navigation__link-text">Scholarships</span>
          </Link>

          <Link
            to="/meetings"
            className={`navigation__link ${isActive('/meetings') ? 'navigation__link--active' : ''}`}
            title="Meetings & Schedule"
          >
            <span className="navigation__link-icon">📅</span>
            <span className="navigation__link-text">Meetings</span>
          </Link>
        </div>
      </div>

      {/* Active indicator bar */}
      <div className="navigation__indicator"></div>
    </nav>
  );
};

export default Navigation;
