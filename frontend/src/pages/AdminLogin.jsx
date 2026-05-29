import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-darker)'
    }}>
      {/* Animated Background Elements */}
      <div className="login-bg-blob login-bg-blob-1"></div>
      <div className="login-bg-blob login-bg-blob-2"></div>
      <div className="login-bg-blob login-bg-blob-3"></div>
      
      <div className="login-card-container">
        <div className="glass-card" style={{ 
          width: '100%', 
          maxWidth: '460px', 
          padding: '3.5rem',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="login-icon-wrapper"> 
              <i className='bx bx-shield-quarter'></i>
            </div>
            <h1 className="login-title">Admin Access</h1>
            <p className="login-subtitle">Sign in to manage diLATech Studio</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="username" className="admin-label">Username</label>
              <div className="input-icon-wrapper">
                <i className='bx bx-user'></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control login-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="password" className="admin-label">Password</label>
              <div className="input-icon-wrapper">
                <i className='bx bx-lock-alt'></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control login-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <i className='bx bx-error-circle'></i> 
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary login-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> 
                  Signing in...
                </>
              ) : (
                <>
                  <i className='bx bx-log-in-circle'></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="login-footer">
            <i className='bx bx-info-circle'></i>
            Authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
