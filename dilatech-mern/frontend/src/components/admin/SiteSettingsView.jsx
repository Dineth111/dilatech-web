import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function SiteSettingsView({ showToast }) {
  const [formData, setFormData] = useState({
    publishedApps: '',
    downloads: '',
    rating: '',
    activeUsers: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/site-data/site_stats');
      if (res.data) {
        setFormData({
          publishedApps: res.data.publishedApps || res.data.apps || '',
          downloads: res.data.downloads || '',
          rating: res.data.rating || '',
          activeUsers: res.data.activeUsers || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site-data/site_stats', {
        value: formData
      });
      showToast('📊 Site statistics updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update statistics.', true);
    }
  };

  return (
    <div className="view active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage <span className="text-primary-gradient">Site Metrics</span></h1>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '650px' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>These statistics appear on the primary landing page of your website.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Published Apps</label>
              <input type="text" name="publishedApps" value={formData.publishedApps} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Total Downloads</label>
              <input type="text" name="downloads" value={formData.downloads} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Average Rating</label>
              <input type="text" name="rating" value={formData.rating} onChange={handleChange} required className="form-control" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Active Users</label>
              <input type="text" name="activeUsers" value={formData.activeUsers} onChange={handleChange} required className="form-control" />
            </div>

          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className='bx bx-save'></i> Update Homepage Statistics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
