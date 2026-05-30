/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ExportPdfButton from './ExportPdfButton';
import { exportDashboardPdf } from '../../lib/exportPdf';

export default function DashboardView({ apps, setActiveTab, showToast }) {
  const [stats, setStats] = useState({ activeUsers: '0', downloads: '0' });
  const [premium, setPremium] = useState({ monthly: '0' });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, premiumRes, reviewsRes] = await Promise.all([
        api.get('/site-data/site_stats'),
        api.get('/site-data/premium_settings'),
        api.get('/site-data/reviews'),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (premiumRes.data) setPremium(premiumRes.data);
      if (Array.isArray(reviewsRes.data)) setReviews(reviewsRes.data);
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
  const topApp = apps.length ? apps.reduce((prev, current) => (parseFloat(current.rating) > parseFloat(prev.rating)) ? current : prev) : null;

  return (
    <div className="view active">
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Dashboard <span className="text-primary-gradient">Overview</span></h1>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Welcome back! Here's your performance at a glance.</p>
        </div>
        <div className="admin-view-actions">
          <ExportPdfButton
            label="📊 Export"
            onClick={() => {
              exportDashboardPdf({ apps, stats, premium, reviews });
              showToast?.('Dashboard PDF downloaded.');
            }}
            disabled={!apps.length}
          />
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('app-form')}>
            <i className='bx bx-plus'></i> New App
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {/* Total Apps */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <i className='bx bx-mobile-alt'></i>
          </div>
          <div className="admin-stat-label">Total Apps</div>
          <div className="admin-stat-value">{apps.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Active portfolio</div>
        </div>

        {/* Total Downloads */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--secondary)' }}>
            <i className='bx bx-download'></i>
          </div>
          <div className="admin-stat-label">Est. Downloads</div>
          <div className="admin-stat-value">{totalDownloads}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Combined reach</div>
        </div>

        {/* Average Rating */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent)' }}>
            <i className='bx bxs-star'></i>
          </div>
          <div className="admin-stat-label">Avg Rating</div>
          <div className="admin-stat-value">{avgRating}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>User feedback</div>
        </div>

        {/* Premium Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent)' }}>
            <i className='bx bxs-crown'></i>
          </div>
          <div className="admin-stat-label">Premium Tier</div>
          <div className="admin-stat-value">${premium?.monthly || '0'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Monthly cost</div>
        </div>
      </div>

      {/* Top Featured App & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Top App Card */}
        {topApp && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">🏆 Top Rated App</h3>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                  <i className={`bx ${topApp.iconBxi}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem', fontWeight: 700 }}>{topApp.name}</h4>
                  <p style={{ margin: '0 0 0.8rem', fontSize: '0.9rem', color: 'var(--muted)' }}>{topApp.shortDesc}</p>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>★ {topApp.rating}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Downloads</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary)' }}>{topApp.downloads}</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('apps-list')} style={{ marginTop: '1rem', width: '100%' }}>
                Manage All Apps
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('app-form')}
                style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', fontSize: '0.95rem' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; }}
              >
                <i className='bx bx-plus-circle' style={{ marginRight: '0.5rem' }}></i> Add New App
              </button>
              <button 
                onClick={() => setActiveTab('manage-reviews')}
                style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', fontSize: '0.95rem' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; }}
              >
                <i className='bx bxs-star' style={{ marginRight: '0.5rem' }}></i> View Reviews ({reviews.length})
              </button>
              <button 
                onClick={() => setActiveTab('contact-messages')}
                style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', fontSize: '0.95rem' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; }}
              >
                <i className='bx bx-envelope' style={{ marginRight: '0.5rem' }}></i> Check Messages
              </button>
              <button 
                onClick={() => setActiveTab('site-settings')}
                style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px', color: 'rgb(200, 150, 255)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', fontSize: '0.95rem' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; }}
              >
                <i className='bx bx-cog' style={{ marginRight: '0.5rem' }}></i> Configure Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">ℹ️ System Information</h3>
        </div>
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Total Apps</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{apps.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Total Reviews</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{reviews.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Status</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>🟢 Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
