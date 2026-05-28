import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApp();
  }, [id]);

  const fetchApp = async () => {
    try {
      const res = await api.get(`/apps/${id}`);
      setApp(res.data);
    } catch (err) {
      console.error('Error loading app:', err);
      // Fallback
      if (id === '1') {
        setApp({
          name: 'Notes+', shortDesc: 'A premium note-taking experience.',
          fullDesc: 'Notes+ is designed to keep your thoughts organized. With powerful tagging, cloud sync, and a beautiful minimalist interface, you can focus on what matters most.',
          rating: 4.8, downloads: '10k+', iconClass: 'ui-notes', iconBxi: 'bx-notepad',
          version: '2.4.1', size: '32 MB',
          features: ['Cloud Sync', 'Markdown Support', 'Dark Mode', 'Widgets']
        });
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  if (!app) {
    return <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>App not found.</div>;
  }

  return (
    <div className="container">
      {/* App Header Hero */}
      <div className="page-hero" style={{ margin: '4rem 0' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', padding: '3rem' }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '30px',
            background: getIconGradient(app.iconClass),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4.5rem',
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
          }}>
            <i className={`bx ${app.iconBxi || 'bx-apps'}`}></i>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '3rem' }}>{app.name}</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--muted)' }}>{app.shortDesc}</p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={app.playStoreUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className='bx bxl-play-store'></i> Play Store
              </a>
              <a href={app.appStoreUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <i className='bx bxl-apple'></i> App Store
              </a>
            </div>
            
            <div className="stats-strip" style={{ marginTop: '2rem', padding: 0, background: 'transparent', border: 'none', gap: '2rem', justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Version</span>
                <strong style={{ fontSize: '1.2rem' }}>{app.version || '1.0'}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Size</span>
                <strong style={{ fontSize: '1.2rem' }}>{app.size || '25 MB'}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Rating</span>
                <strong style={{ fontSize: '1.2rem' }}><i className='bx bxs-star text-accent'></i> {app.rating}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Downloads</span>
                <strong style={{ fontSize: '1.2rem' }}>{app.downloads}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Features Grid */}
      <div className="details-grid" style={{ marginBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>About <span className="text-primary-gradient">{app.name}</span></h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>{app.fullDesc || app.shortDesc}</p>
        </div>

        {app.features && app.features.length > 0 && (
          <div className="glass-card" style={{ padding: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Key Features</h2>
            <ul className="check-list" style={{ marginTop: '1rem' }}>
              {app.features.map((feature, idx) => (
                <li key={idx} style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <i className='bx bx-check-circle' style={{ color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                    <strong style={{ color: 'white', fontWeight: 500 }}>{feature}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', padding: '2rem 0 4rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ borderRadius: '50px' }}>
          <i className='bx bx-arrow-back'></i> Back to Portfolio
        </button>
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
