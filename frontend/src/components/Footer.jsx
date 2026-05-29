import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <i className='bx bx-cube-alt'></i> diLA<span>Tech</span>
            </Link>
            <p className="muted" style={{ marginTop: '1rem' }}>Bringing ideas directly to millions of screens. Available for freelance iOS and Android development works.</p>
          </div>

          <div className="footer-links">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/premium">Premium</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-links">
            <h4>Legal & Admin</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/admin/login">Admin Portal</Link>
          </div>
        </div>
        
        <div className="copyright">
          &copy; {new Date().getFullYear()} diLA Tech Studios. All rights reserved. Built with React.
        </div>
      </div>
    </footer>
  );
}
