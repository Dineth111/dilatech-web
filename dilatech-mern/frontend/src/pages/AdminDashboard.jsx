import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (!res.data.isAdmin) {
        navigate('/admin/login');
      } else {
        setUser(res.data);
        fetchApps();
      }
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchApps = async () => {
    try {
      const res = await api.get('/apps');
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading apps:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 3rem' }}>
        <h1 style={{ margin: 0 }}>Admin <span className="text-primary-gradient">Dashboard</span></h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ borderRadius: '12px' }}>
          <i className='bx bx-log-out'></i> Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            <i className='bx bx-grid-alt'></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>Total Apps</p>
            <h3 style={{ margin: 0, fontSize: '2.5rem' }}>{apps.length}</h3>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            <i className='bx bx-shield-check'></i>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>Admin Status</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text)' }}>Active</h3>
          </div>
        </div>
      </div>

      {/* Apps Table */}
      <div className="glass-card" style={{ padding: '2.5rem', overflowX: 'auto', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Applications</h2>
          <button className="btn btn-primary btn-sm"><i className='bx bx-plus'></i> Add App</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>Rating</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>Downloads</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: 'var(--muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}>
                <td style={{ padding: '1.2rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '45px', height: '45px', borderRadius: '12px',
                      background: getIconGradient(app.iconClass),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      <i className={`bx ${app.iconBxi || 'bx-apps'}`}></i>
                    </div>
                    <strong style={{ fontSize: '1.1rem' }}>{app.name}</strong>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1rem', color: 'var(--muted)' }}>
                  <span className="badge" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}>{app.category || 'App'}</span>
                </td>
                <td style={{ padding: '1.2rem 1rem', color: 'var(--text)' }}><i className='bx bxs-star text-accent'></i> {app.rating}</td>
                <td style={{ padding: '1.2rem 1rem', color: 'var(--text)' }}>{app.downloads}</td>
                <td style={{ padding: '1.2rem 1rem', textAlign: 'right' }}>
                  <button className="btn btn-outline btn-sm" style={{ padding: '0.4rem', minHeight: 'auto', borderRadius: '8px' }}>
                    <i className='bx bx-edit-alt'></i>
                  </button>
                  <button className="btn btn-outline btn-sm" style={{ padding: '0.4rem', minHeight: 'auto', borderRadius: '8px', marginLeft: '0.5rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                    <i className='bx bx-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apps.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}><i className='bx bx-ghost'></i></div>
            <p>No applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getIconGradient(iconClass) {
  const gradients = {
    'ui-notes': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'ui-fitness': 'linear-gradient(135deg, #ef4444, #b91c1c)',
    'ui-finance': 'linear-gradient(135deg, #10b981, #047857)',
    'studio': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  };
  return gradients[iconClass] || 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
}
