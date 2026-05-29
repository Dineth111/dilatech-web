import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/premium', label: 'Premium', icon: 'bx-crown', color: '#f59e0b' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null); // ✅ ref on the entire header, not just <nav>
  const navId = 'primary-navigation';

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close when clicking outside the whole navbar header
  useEffect(() => {
    if (!open) return; // only listen when menu is open

    function onClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    // Use setTimeout so this listener doesn't catch the same click that opened the menu
    const timer = setTimeout(() => {
      document.addEventListener('click', onClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', onClickOutside);
    };
  }, [open]);

  // Close on route scroll / resize
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768) setOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="navbar" ref={headerRef}>
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <i className="bx bx-cube-alt" aria-hidden="true" /> diLA<span>Tech</span>
        </Link>

        {/* Hamburger toggle — only visible on mobile via CSS */}
        <button
          type="button"
          className={`nav-toggle${open ? ' is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={navId}
        >
          <span className="sr-only">{open ? 'Close navigation menu' : 'Open navigation menu'}</span>
          <i className={`bx ${open ? 'bx-x' : 'bx-menu'}`} aria-hidden="true" />
        </button>

        <nav
          id={navId}
          className={`nav-links${open ? ' open' : ''}`}
          role="navigation"
          aria-hidden={!open}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={link.to === '/'}
              style={link.color ? { color: link.color } : {}}
            >
              {link.icon && (
                <i className={`bx ${link.icon}`} style={{ marginRight: '8px' }} aria-hidden="true" />
              )}
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
            Hire Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
