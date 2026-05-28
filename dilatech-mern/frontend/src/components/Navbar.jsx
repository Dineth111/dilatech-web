import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/premium', label: 'Premium', icon: 'bx-crown', color: '#f59e0b' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <i className='bx bx-cube-alt'></i> diLA<span>Tech</span>
        </Link>

        <button type="button" className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          <i className={`bx ${open ? 'bx-x' : 'bx-menu'}`} />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
              style={link.color ? { color: link.color } : {}}
            >
              {link.icon && <i className={`bx ${link.icon}`} style={{ marginRight: '5px' }}></i>}
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
