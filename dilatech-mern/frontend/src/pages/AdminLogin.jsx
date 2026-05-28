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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', 
            background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '2rem', margin: '0 auto 1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <i className='bx bx-lock-alt'></i>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Admin Access</h1>
          <p style={{ color: 'var(--muted)' }}>Sign in to manage the studio</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="admin"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className='bx bx-error-circle'></i> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Studio administrator credentials required
        </p>
      </div>
    </div>
  );
}
