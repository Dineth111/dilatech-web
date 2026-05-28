import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function DashboardView({ apps, setActiveTab }) {
  const [stats, setStats] = useState({ activeUsers: '0', downloads: '0' });
  const [premium, setPremium] = useState({ monthly: '0' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, premiumRes] = await Promise.all([
        api.get('/site-data/site_stats'),
        api.get('/site-data/premium_settings')
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (premiumRes.data) setPremium(premiumRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalDownloadsRaw = apps.reduce((sum, app) => {
    const d = parseFloat(app.downloads || 0);
    const multiplier = String(app.downloads || '').toLowerCase().includes('k') ? 1000 : 1;
    return sum + (d * multiplier);
  }, 0);
  const totalDownloads = totalDownloadsRaw >= 1000 ? (totalDownloadsRaw / 1000).toFixed(0) + 'k+' : totalDownloadsRaw + '+';
  const avgRating = apps.length ? (apps.reduce((sum, app) => sum + parseFloat(app.rating || 0), 0) / apps.length).toFixed(1) : 0;

  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Dashboard <span className="text-primary-gradient">Overview</span></h1>
        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('app-form')}>
          <i className='bx bx-plus'></i> Add New App
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <i className="bx bx-mobile-alt" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Total Apps</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{apps.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <i className="bx bx-download" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Est. Downloads</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{totalDownloads}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <i className="bx bxs-star" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Avg Rating</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{avgRating}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid var(--accent)', background: 'rgba(245,158,11,0.05)' }}>
          <i className="bx bxs-crown" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}></i>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Premium Pricing</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>${premium?.monthly || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '3px solid var(--primary)', background: 'rgba(59,130,246,0.05)' }}>
          <i className="bx bx-group" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}></i>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Live Metrics</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{stats?.activeUsers || 0}</div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Published Apps</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('apps-list')}>View All →</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>App</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Rating</th>
              <th style={{ textAlign: 'left', padding: '0.8rem 1.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', fontWeight: 700, background: 'rgba(0,0,0,0.2)' }}>Downloads</th>
            </tr>
          </thead>
          <tbody>
            {apps.slice(0, 5).map(app => (
              <tr key={app.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', background: 'rgba(255,255,255,0.1)' }}>
                      <i className={`bx ${app.iconBxi}`}></i>
                    </div>
                    <span>{app.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--muted)' }}>{app.category}</span>
                </td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>★ {app.rating}</span></td>
                <td style={{ padding: '1rem 1.2rem', fontSize: '0.95rem' }}>{app.downloads}+</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
