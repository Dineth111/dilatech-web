import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

import Sidebar from '../components/admin/Sidebar';
import DashboardView from '../components/admin/DashboardView';
import AppsListView from '../components/admin/AppsListView';
import AppFormView from '../components/admin/AppFormView';
import PremiumSettingsView from '../components/admin/PremiumSettingsView';
import SiteSettingsView from '../components/admin/SiteSettingsView';
import ManageReviewsView from '../components/admin/ManageReviewsView';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App form editing state
  const [editingApp, setEditingApp] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, msg: '', isErr: false });

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

  const showToast = (msg, isErr = false) => {
    setToast({ show: true, msg, isErr });
    setTimeout(() => setToast({ show: false, msg: '', isErr: false }), 3000);
  };

  const handleEditApp = (appId) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      setEditingApp(app);
      setActiveTab('app-form');
    }
  };

  const handleDeleteApp = async (app) => {
    if (window.confirm(`Are you sure you want to delete "${app.name}"? This cannot be undone.`)) {
      try {
        await api.delete(`/apps/${app.id}`);
        showToast(`🗑️ "${app.name}" deleted.`, true);
        fetchApps();
      } catch (err) {
        console.error(err);
        showToast('Failed to delete app.', true);
      }
    }
  };

  const handleSaveApp = async (appData) => {
    try {
      if (editingApp) {
        await api.put(`/apps/${appData.id}`, appData);
      } else {
        await api.post('/apps', appData);
      }
      showToast(`✅ "${appData.name}" saved successfully!`);
      setEditingApp(null);
      fetchApps();
      setActiveTab('apps-list');
    } catch (err) {
      console.error(err);
      showToast('Failed to save app.', true);
    }
  };

  // Watch for clicking "Add New App" to clear editing state
  useEffect(() => {
    if (activeTab === 'app-form' && !editingApp) {
      setEditingApp(null);
    }
    if (activeTab !== 'app-form') {
      setEditingApp(null);
    }
  }, [activeTab]);

  if (loading) {
    return <div className="route-loader"><div className="spinner"></div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
        {activeTab === 'dashboard' && <DashboardView apps={apps} setActiveTab={setActiveTab} />}
        {activeTab === 'apps-list' && <AppsListView apps={apps} setActiveTab={setActiveTab} onEdit={handleEditApp} onDelete={handleDeleteApp} />}
        {activeTab === 'app-form' && <AppFormView app={editingApp} onSave={handleSaveApp} onCancel={() => setActiveTab('apps-list')} />}
        {activeTab === 'premium-settings' && <PremiumSettingsView showToast={showToast} />}
        {activeTab === 'site-settings' && <SiteSettingsView showToast={showToast} />}
        {activeTab === 'manage-reviews' && <ManageReviewsView showToast={showToast} />}
      </div>

      {/* Toast Notification */}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
        background: '#1e293b', border: `1px solid ${toast.isErr ? 'var(--danger)' : 'var(--secondary)'}`,
        borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        transform: toast.show ? 'translateY(0)' : 'translateY(120px)',
        opacity: toast.show ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        fontWeight: 600, color: 'white'
      }}>
        <i className={toast.isErr ? 'bx bx-error-circle' : 'bx bx-check-circle'} style={{ color: toast.isErr ? 'var(--danger)' : 'var(--secondary)', fontSize: '1.2rem' }}></i>
        <span>{toast.msg}</span>
      </div>

    </div>
  );
}
